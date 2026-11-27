import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChecklistComments } from '../src/components/ChecklistUI';
import PesosTapaScreen from '../src/screens/PesosTapaScreen';
import PesosCuerpoScreen from '../src/screens/PesosCuerpoScreen';
import PesosBaseScreen from '../src/screens/PesosBaseScreen';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { job: 'JOB-1' } }),
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ Nomina: '123' }))),
}));

jest.mock('@react-native-community/checkbox', () => require('react-native').View);

jest.mock('@react-native-picker/picker', () => {
  const ReactModule = require('react');
  const View = require('react-native').View;
  const MockPicker = ({ children, ...props }: any) => ReactModule.createElement(View, props, children);
  MockPicker.Item = () => null;
  return { Picker: MockPicker };
});

describe('registro de pesos y espumado', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  afterAll(() => alertSpy.mockRestore());

  test.each([
    ['tapa', PesosTapaScreen, 'pesosTapa', '7.60'],
    ['cuerpo', PesosCuerpoScreen, 'pesosCuerpo', '18.00'],
    ['base', PesosBaseScreen, 'pesosBase', '6.00'],
  ])('%s guarda los datos y el tiempo mostrado', async (_name, Screen, endpoint, time) => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Screen />);
    });
    await act(async () => {
      const inputs = renderer!.root.findAllByType(TextInput);
      const setInput = (label: string, value: string) =>
        inputs.find(input => input.props.accessibilityLabel === label)!.props.onChangeText(value);
      setInput('Temperatura de molde', '115');
      setInput('Peso antes', '10');
      setInput('Peso después', '12');
      setInput('ID termómetro', 'T-1');
      renderer!.root.findByType(Picker).props.onValueChange('2');
      renderer!.root.findByType(ChecklistComments).props.onChange('Comentario');
      renderer!.root.findByProps({ accessibilityLabel: `Confirmar tiempo de disparo ${time}` }).props.onPress();
      const approved = renderer!.root.findAllByType(TouchableOpacity).find(button =>
        button.findAllByType(Text).some(text => text.props.children === 'APROBADO'),
      );
      approved!.props.onPress();
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain(endpoint);
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      job: 'JOB-1',
      nomina: '123',
      temperatura: '115',
      pesoAntes: '10',
      pesoDespues: '12',
      maquinado: '2',
      termometroId: 'T-1',
      comentarios: 'Comentario',
      tiempodisparo: time,
      aprobado: 'SI',
    }));
    expect(alertSpy).toHaveBeenCalledWith(
      'Guardado',
      'Los datos se guardaron correctamente.',
      expect.any(Array),
    );
    expect(mockGoBack).not.toHaveBeenCalled();
    await act(async () => alertSpy.mock.calls[0][2]![0].onPress!());
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  }, 15000);

  test.each([
    ['tapa', PesosTapaScreen, '7.60'],
    ['cuerpo', PesosCuerpoScreen, '18.00'],
    ['base', PesosBaseScreen, '6.00'],
  ])('%s solicita confirmación antes de guardar sin marcar el tiempo', async (_name, Screen, time) => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Screen />);
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    expect(global.fetch).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'Confirmación requerida',
      'Favor de confirmar el tiempo de disparo',
      expect.any(Array),
    );
    await act(async () => alertSpy.mock.calls[0][2]![1].onPress!());
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(payload.tiempodisparo).toBe(time);
    expect(payload.aprobado).toBe('NO');
    expect(alertSpy.mock.calls[1][0]).toBe('Guardado');
    await act(async () => alertSpy.mock.calls[1][2]![0].onPress!());
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  test('muestra un error cuando falla el guardado', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<PesosTapaScreen />);
    });
    await act(async () => {
      renderer!.root.findByProps({ accessibilityLabel: 'Confirmar tiempo de disparo 7.60' }).props.onPress();
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => save!.props.onPress());
    expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudieron guardar los datos. Intenta de nuevo.');
    expect(mockGoBack).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('no muestra éxito ni sale si el servidor rechaza los datos', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: 'No se guardó' }),
    });
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<PesosTapaScreen />);
    });
    await act(async () => {
      renderer!.root.findByProps({ accessibilityLabel: 'Confirmar tiempo de disparo 7.60' }).props.onPress();
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    expect(alertSpy).toHaveBeenCalledWith('Error', 'No se guardó');
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  test('evita envíos duplicados mientras se guarda', async () => {
    let resolveFetch: (response: { ok: boolean; json: () => Promise<{ success: boolean }> }) => void;
    (global.fetch as jest.Mock).mockReturnValue(new Promise(resolve => {
      resolveFetch = resolve;
    }));
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<PesosTapaScreen />);
    });
    await act(async () => {
      renderer!.root.findByProps({ accessibilityLabel: 'Confirmar tiempo de disparo 7.60' }).props.onPress();
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => {
      save!.props.onPress();
      save!.props.onPress();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveFetch!({ ok: true, json: async () => ({ success: true }) });
    });
    expect(alertSpy.mock.calls[0][0]).toBe('Guardado');
  });
});
