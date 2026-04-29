import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';


export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      
    },

    header: {
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.space,
      backgroundColor: theme.colors.surface,
      paddingTop: 15,
    },

    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },

    scroll: {
      flex: 1,
    },

    content: {
      padding: 16,
      gap: 12,
      
    },
  });
