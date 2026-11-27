import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChecklistComments, ChecklistItem } from '../src/components/ChecklistUI';
import LIDScreen from '../src/screens/LIDScreen';
import TopScreen from '../src/screens/TopScreen';
import BottomScreen from '../src/screens/BottomScreen';
import MasterScreen from '../src/screens/MasterScreen';
import FinalCheckScreen from '../src/screens/FinalCheckScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: { job: 'JOB-1' } }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ Nomina: '123' }))),
}));

jest.mock('@react-native-community/checkbox', () => {
  const { View } = require('react-native');
  return View;
});

describe('checklists', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });
  });

  afterAll(() => alertSpy.mockRestore());

  test.each([
    ['LID', LIDScreen, 'incompleteLid', 9],
    ['TOP', TopScreen, 'incompleteTop', 7],
    ['BOTTOM', BottomScreen, 'incompleteBottom', 8],
    ['MASTER', MasterScreen, 'incompleteMaster', 12],
    ['final', FinalCheckScreen, 'incompleteFinal', 13],
  ])('%s conserva las respuestas y comentarios al guardar incompleto', async (_name, Screen, endpoint, count) => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Screen />);
    });

    const items = renderer!.root.findAllByType(ChecklistItem);
    expect(items).toHaveLength(count);
    await act(async () => {
      items[0].props.onChange(true);
      renderer!.root.findByType(ChecklistComments).props.onChange('Observación de prueba');
    });
    expect(renderer!.root.findAllByType(ChecklistItem)[0].props.checked).toBe(true);

    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    expect(save).toBeDefined();
    await act(async () => save!.props.onPress());
    const confirmation = alertSpy.mock.calls[0][2];
    expect(confirmation).toBeDefined();
    await act(async () => confirmation![1].onPress!());

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain(endpoint);
    const payload = JSON.parse(options.body);
    expect(payload.job).toBe('JOB-1');
    expect(payload.nomina).toBe('123');
    expect(payload.checkboxes[0]).toBe(true);
    expect(payload.comentarios).toBe('Observación de prueba');
  }, 15000);

  test('el checklist final conserva el orden de las secciones al guardar', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<FinalCheckScreen />);
    });
    await act(async () => {
      const items = renderer!.root.findAllByType(ChecklistItem);
      items[4].props.onChange(true);
      items[8].props.onChange(true);
      items[12].props.onChange(true);
    });
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    await act(async () => alertSpy.mock.calls[0][2]![1].onPress!());
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    // Mismo orden que la pantalla y que las columnas del backend:
    // puntos 1-4, limpieza A-D, blower A-B, puntos 7-9
    expect(payload.checkboxes).toEqual([
      false, false, false, false,
      true, false, false, false,
      true, false,
      false, false, true,
    ]);
  });

  test('LID conserva las mediciones y los datos del motor', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<LIDScreen />);
    });
    await act(async () => {
      renderer!.root.findByProps({ accessibilityLabel: 'Distancia actual de blower' }).props.onChangeText('0.25');
      renderer!.root.findByProps({ accessibilityLabel: 'Torque actual' }).props.onChangeText('13');
      renderer!.root.findByProps({ accessibilityLabel: 'Número de serie o lote del motor' }).props.onChangeText('S1');
      renderer!.root.findByProps({ accessibilityLabel: 'Modelo del motor' }).props.onChangeText('M1');
    });
    expect(renderer!.root.findAllByType(TextInput).length).toBeGreaterThanOrEqual(4);
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    await act(async () => alertSpy.mock.calls[0][2]![1].onPress!());
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(payload).toEqual(expect.objectContaining({
      blowerDistance: '0.25',
      torqueValue: '13',
      serie: 'S1',
      modelo: 'M1',
    }));
  });

  test('al marcar todas las tarjetas de TOP se envía como completo', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<TopScreen />);
    });
    for (let index = 0; index < 7; index += 1) {
      await act(async () => {
        const card = renderer!.root.findAllByType(ChecklistItem)[index];
        card.findByType(TouchableOpacity).props.onPress();
      });
    }
    expect(renderer!.root.findByType(ChecklistComments).props.complete).toBe(true);
    const save = renderer!.root.findAllByType(TouchableOpacity).find(button =>
      button.findAllByType(Text).some(text => text.props.children === 'GUARDAR'),
    );
    await act(async () => save!.props.onPress());
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('completeTop');
    expect(JSON.parse(options.body).checkboxes).toEqual(Array(7).fill(true));
  });
});
