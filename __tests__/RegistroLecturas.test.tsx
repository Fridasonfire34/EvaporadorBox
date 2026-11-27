import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RegistroLecturasScreen from '../src/screens/RegistroLecturasScreen';
import { ChecklistComments } from '../src/components/ChecklistUI';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: { job: 'JOB-1' } }),
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

describe('registro de lecturas', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ success: true }) });
  });

  afterAll(() => alertSpy.mockRestore());

  test.each([
    ['APROBADO', 'SI'],
    ['NO APROBADO', 'NO'],
  ])('guarda ambas lecturas y el resultado %s', async (approval, expected) => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<RegistroLecturasScreen />);
    });

    await act(async () => {
      const inputs = renderer!.root.findAllByType(TextInput);
      const setInput = (label: string, value: string) =>
        inputs.find(input => input.props.accessibilityLabel === label)!.props.onChangeText(value);
      setInput('Drain pan A, temperatura ambiente', '21');
      setInput('Drain pan A, TC 1', '22');
      setInput('Drain pan A, TC 2', '23');
      setInput('Drain pan B, temperatura ambiente', '20');
      setInput('Drain pan B, TC 1', '19');
      setInput('Drain pan B, TC 2', '18');
      const pickers = renderer!.root.findAllByType(Picker);
      pickers[0].props.onValueChange('sí');
      pickers[1].props.onValueChange('no');
      renderer!.root.findByType(ChecklistComments).props.onChange('Comentario');
      const resultButton = renderer!.root.findAllByType(TouchableOpacity).find(button =>
        button.findAllByType(Text).some(text => text.props.children === approval),
      );
      resultButton!.props.onPress();
    });

    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('registroLecturas');
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      job: 'JOB-1',
      nomina: '123',
      drainA: { ambiente: '21', tc1: '22', tc2: '23', linea3: 'sí' },
      drainB: { ambiente: '20', tc1: '19', tc2: '18', linea3: 'no' },
      comentarios: 'Comentario',
      aprobado: expected,
    }));
  }, 15000);

  test('conserva el resultado no aprobado al guardar sin selección', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<RegistroLecturasScreen />);
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(payload.aprobado).toBe('NO');
    expect(payload.drainA.linea3).toBe('');
    expect(payload.drainB.linea3).toBe('');
  });
});
