import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text, TouchableOpacity } from 'react-native';
import PesosScreen from '../src/screens/PesosScreen';

const mockFocusCallbacks: Array<() => (() => void) | void> = [];

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { job: 'JOB-1' } }),
  useNavigation: () => ({ navigate: jest.fn() }),
  useFocusEffect: (callback: () => (() => void) | void) => {
    mockFocusCallbacks.push(callback);
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ Nomina: '123' }))),
}));

test('actualiza el estado de los registros al volver al menú', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ statusTapas: 'OK' }) });

  let renderer: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<PesosScreen />);
  });
  const refreshStatus = mockFocusCallbacks[1];
  let cleanup: (() => void) | void;
  await act(async () => {
    cleanup = refreshStatus();
  });
  if (cleanup!) {
    cleanup();
  }
  await act(async () => {
    refreshStatus();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  const tapa = renderer!.root.findAllByType(TouchableOpacity).find(button =>
    button.findAllByType(Text).some(text => text.props.children === 'Registro de Pesos y Espumado: TAPA'),
  );
  await act(async () => tapa!.props.onPress());
  expect(alertSpy).toHaveBeenCalledWith(
    'Checklist completo',
    expect.any(String),
    expect.any(Array),
  );
  alertSpy.mockRestore();
}, 15000);
