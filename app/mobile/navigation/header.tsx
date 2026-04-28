import React from 'react';
import { View, Text, Platform, StatusBar } from 'react-native';
import { useTheme } from '../contexts/Theme/themeContext';

export const CustomHeader = ({ title }: { title: string }) => {
  const { theme } = useTheme();

  return (
    <View style={{ 
      height: Platform.OS === 'ios' ? 90 : 60, // Ajuste para acomodar o entalhe do iOS
      backgroundColor: theme.colors.surface, 
      flexDirection: 'row', 
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight, // Evita sobrepor a barra de status
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.05)' // Uma linha sutil para separar do conteúdo
    }}>
      <Text style={{ 
        color: theme.colors.text, 
        fontWeight: 'bold', 
        fontSize: 18 
      }}>
        {title}
      </Text>
    </View>
  );
};