// src/screens/Perfil/styles.ts

import { StyleSheet } from 'react-native';
import { ThemeType } from '../../contexts/Theme/themeContext';

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingTop: 20,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 28,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text,
    },

    userArea: {
      alignItems: 'center',
      marginBottom: 24,
    },

    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },

    name: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },

    card: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 14,
    },

    infoContent: {
      flex: 1,
    },

    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },

    value: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },

    menuCard: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 14,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.space,
    },

    menuText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },

    responsavel: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },

    responsavelNome: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
    },

    responsavelTelefone: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },

    logoutButton: {
      marginTop: 8,
      marginBottom: 40,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.colors.error,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },

    logoutText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });