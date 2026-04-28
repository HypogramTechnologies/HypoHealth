import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },

    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 6,
    },

    buttonText: {
      color: theme.colors.text,
      fontWeight: '600',
    },

    list: {
      gap: 14,
      paddingBottom: 30,
    },

    card: {
    //   backgroundColor: theme.colors.,
      borderRadius: 18,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },

    cardDone: {
      backgroundColor: theme.colors.cardDone,
      borderColor: theme.colors.cardDoneBorder,
    },

    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },

    iconBox: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: theme.colors.iconBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },

    name: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },

    info: {
      marginTop: 4,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },

    right: {
      alignItems: 'flex-end',
      gap: 4,
    },

    time: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },

    doneText: {
      color: theme.colors.doneText,
      fontWeight: '700',
      fontSize: 14,
    },
  });