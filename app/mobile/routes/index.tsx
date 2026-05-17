import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/Auth/useAuth';

import { AppStack } from '../navigation/appStack'; 
import { AuthStack } from '../navigation/authStack'; 

export function Routes() {
  const { usuario } = useAuth();
  
  return (
    <NavigationContainer>
      {usuario ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}