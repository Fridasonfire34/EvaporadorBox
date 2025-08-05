import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import axios from 'axios';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import InicioScreen from './src/screens/InicioScreen';
import MenuScreen from './src/screens/MenuScreen';
import RegistroLecturasScreen from './src/screens/RegistroLecturasScreen';
import JobsScreen from './src/screens/JobsScreen';
import PesosScreen from './src/screens/PesosScreen';


const Stack = createStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    const requestCameraPermission = async (): Promise<void> => {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        if (result !== RESULTS.GRANTED) {
        }
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'La cámara es necesaria para continuar.');
        }
      }
    };

    requestCameraPermission();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pesos"
          component={PesosScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistroLecturas"
          component={RegistroLecturasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobsScreen"
          component={JobsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
