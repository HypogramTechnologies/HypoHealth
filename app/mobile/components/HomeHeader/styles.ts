import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#129B83',
      paddingHorizontal: 22,
      paddingTop: 60,
      paddingBottom: 24,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 22,
    },

    greeting: {
      color: '#D7F7F0',
      fontSize: 16,
    },

    name: {
      color: '#FFF',
      fontSize: 34,
      fontWeight: '700',
    },

    profileButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    card: {
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRadius: 18,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },

    cardTitle: {
      color: '#FFF',
      fontSize: 17,
      fontWeight: '700',
    },

    cardSubtitle: {
      color: '#DDF8F2',
      marginTop: 4,
      fontSize: 15,
    },
  });