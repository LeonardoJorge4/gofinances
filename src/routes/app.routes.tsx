import React from 'react';
import { Platform } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Resume } from '../screens/Resume';
import { Register } from '../screens/Register';
import { Dashboard } from '../screens/Dashboard';

import theme from '../global/styles/theme';

const { Navigator, Screen } = createBottomTabNavigator();

export interface GoFinancesRoutesList {
  Listing: undefined; // <- undefined = rota não requer parâmetros.
  Register: undefined;
  Summary: undefined;
};

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height:  Platform.OS === 'ios' ? 88 : 60,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        }
      }}
    >
      <Screen
        name="Listing"
        component={Dashboard}
        options={{
          title: "Listagem",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="format-list-bulleted"
            />
          ))
        }}
      />

      <Screen
        name="Register"
        component={Register}
        options={{
          title: "Cadastrar",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="attach-money"
            />
          ))
        }}
      />

      <Screen
        name="Summary"
        component={Resume}
        options={{
          title: "Resumo",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="pie-chart"
            />
          ))
        }}
      />
    </Navigator>
  )
}