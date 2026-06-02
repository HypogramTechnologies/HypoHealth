import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../../styles/theme';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export type ThemeType = typeof lightTheme | typeof darkTheme;

type ThemeContextData = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme() || 'light';
  
  // Começa com o tema do sistema, mas vamos atualizar logo em seguida
  const [theme, setTheme] = useState<ThemeType>(
    systemScheme === 'dark' ? darkTheme : lightTheme
  );

  // 1. Carrega o tema salvo quando o App inicia
  useEffect(() => {
    async function loadSavedTheme() {
      try {
        const savedMode = await AsyncStorage.getItem('@app_theme_mode');
        if (savedMode) {
          setTheme(savedMode === 'dark' ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.log('Erro ao carregar o tema', error);
      }
    }
    loadSavedTheme();
  }, []);

  // 2. Função de alterar o tema que também salva a escolha do usuário
  async function toggleTheme() {
    try {
      const nextTheme = theme.mode === 'light' ? darkTheme : lightTheme;
      setTheme(nextTheme);
      await AsyncStorage.setItem('@app_theme_mode', nextTheme.mode); 
    } catch (error) {
      console.log('Erro ao salvar o tema', error);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}