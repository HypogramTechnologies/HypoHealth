import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';

export const useStyles = (theme: ThemeType) => {
    return StyleSheet.create({

    section: {
      fontSize: 18,
      fontWeight: '700',
      color:
        theme.colors.text,
      marginTop: 20,
      marginBottom: 12,
    },

    grid: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      gap: 10,
    },

    numberBox: {
      width: 70,
      height: 54,
      borderRadius: 16,
      backgroundColor:
        theme.colors
          .backgroundCard,
      borderWidth: 1,
      borderColor:
        theme.colors
          .border,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    numberBoxActive: {
      backgroundColor:
        theme.colors
          .primary,
      borderColor:
        theme.colors
          .primary,
    },

    numberText: {
      fontSize: 20,
      fontWeight: '700',
      color:
        theme.colors.text,
    },

    numberTextActive: {
      color: theme.colors.text,
    },

    selectCard: {
      height: 110,
      borderRadius: 18,
      backgroundColor:
        theme.colors
          .backgroundCard,
      borderWidth: 1,
      borderColor:
        theme.colors
          .border,
      justifyContent:
        'center',
      alignItems:
        'center',
      marginBottom: 12,
    },

    selectCardActive: {
      borderColor:
        theme.colors
          .primary,
      backgroundColor:
        theme.colors
          .backgroundCardDestaque,
    },

    selectTitle: {
      fontWeight: '700',
      color:
        theme.colors.text,
      marginTop: 8,
    },

    selectSubtitle: {
      fontSize: 12,
      color:
        theme.colors
          .opaco,
      marginTop: 4,
    },

    timeRow: {
      flexDirection:
        'row',
      gap: 10,
      marginBottom: 10,
      alignItems:
        'center',
    },

    timeInput: {
      flex: 1,
      height: 56,
      borderRadius: 16,
      paddingHorizontal: 16,
      backgroundColor:
        theme.colors
          .backgroundCard,
      borderWidth: 1,
      borderColor:
        theme.colors
          .border,
      fontSize: 24,
      fontWeight: '700',
      color:
        theme.colors.text,
    },

    btnPrimary: {
      height: 56,
      borderRadius: 16,
      backgroundColor:
        theme.colors
          .primary,
      justifyContent:
        'center',
      alignItems:
        'center',
      flexDirection:
        'row',
      gap: 8,
      marginTop: 18,
    },

    btnPrimaryText: {
      color: theme.colors.text,
      fontWeight: '700',
    },

    btnOutline: {
      height: 52,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle:
        'dashed',
      borderColor:
        theme.colors
          .primary,
      justifyContent:
        'center',
      alignItems:
        'center',
      flexDirection:
        'row',
      gap: 8,
      marginTop: 10,
    },

    descriptionText: {
      fontSize: 12,
      opacity: 0.7,
      color: theme.colors.text,
    },

    descriptionTextActive: {
      opacity: 1,
     
    },

    btnOutlineText: {
      color:
        theme.colors
          .primary,
      fontWeight: '700',
    },
  });
};