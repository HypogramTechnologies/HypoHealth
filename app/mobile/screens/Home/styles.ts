import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 18,
    },
  });