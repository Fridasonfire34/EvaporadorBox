module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  // Paquetes que se publican como ESM y Jest debe transformar
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*)/)',
  ],
};
