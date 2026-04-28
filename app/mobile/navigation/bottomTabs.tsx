// src/routes/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../mobile/contexts/Theme/themeContext';

import {Home} from '../screens/Home'; 
import { Perfil } from '../screens/Perfil';
// import {Historico} from '../screens/Home'; 
// import {Perfil} from '../screens/Home'; 
// import {Alerta} from '../screens/Home'; 


const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactiveTab,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundCard,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" color={color} size={size} />
          ),
        }}
      />
  
     <Tab.Screen 
        name="Histórico" 
        component={Home} 
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock" color={color} size={size} />
          ),
        }}
      />

       <Tab.Screen 
        name="Alertas" 
        component={Home} 
        options={{
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />

        <Tab.Screen 
        name="Perfil" 
        component={Perfil} 
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}