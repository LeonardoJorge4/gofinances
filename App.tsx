import React from 'react';
import { StatusBar } from 'react-native';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Routes } from './src/routes';
import theme from './src/global/styles/theme';
import { AuthProvider, useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });
  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
