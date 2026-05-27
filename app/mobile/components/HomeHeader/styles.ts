import { StyleSheet } from 'react-native';

import { ThemeType } from '../../contexts/Theme/themeContext';

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#129B83',

      paddingHorizontal: 22,
      paddingTop: 60,
      paddingBottom: 24,

      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 10,
      },

      shadowOpacity: 0.12,
      shadowRadius: 18,

      elevation: 10,
    },

    topRow: {
      flexDirection: 'row',

      justifyContent: 'space-between',

      alignItems: 'flex-start',

      marginBottom: 24,
    },

    accountBadge: {
      alignSelf: 'flex-start',

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        'rgba(255,255,255,0.18)',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.25)',

      paddingHorizontal: 12,
      paddingVertical: 7,

      borderRadius: 999,

      marginBottom: 14,
    },

    accountBadgeText: {
      color: '#FFF',

      fontSize: 13,

      fontWeight: '700',

      marginLeft: 6,
    },

    greeting: {
      color: '#D7F7F0',

      fontSize: 18,

      marginBottom: 4,
    },

    name: {
      color: '#FFF',

      fontSize: 38,

      fontWeight: '800',

      letterSpacing: -1,
    },

    profileButton: {
      width: 66,
      height: 66,

      borderRadius: 33,

      backgroundColor: '#F5F5F5',

      justifyContent: 'center',
      alignItems: 'center',

      borderWidth: 4,

      borderColor:
        'rgba(255,255,255,0.18)',

      position: 'relative',
    },

    profileLetter: {
      color: '#129B83',

      fontSize: 28,

      fontWeight: '800',
    },

    heartMiniBadge: {
      position: 'absolute',

      bottom: -2,
      right: -2,

      width: 22,
      height: 22,

      borderRadius: 11,

      backgroundColor: '#F59E0B',

      justifyContent: 'center',
      alignItems: 'center',

      borderWidth: 2,
      borderColor: '#129B83',
    },

    careCard: {
      backgroundColor: '#F59E0B',

      borderRadius: 24,

      padding: 18,

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 18,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 10,
      },

      shadowOpacity: 0.12,
      shadowRadius: 18,

      elevation: 8,
    },

    careAvatar: {
      width: 68,
      height: 68,

      borderRadius: 34,

      backgroundColor: '#FFF',

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: 16,

      position: 'relative',
    },

    careAvatarText: {
      color: '#129B83',

      fontSize: 28,

      fontWeight: '800',
    },

    careHeart: {
      position: 'absolute',

      bottom: -2,
      right: -2,

      width: 24,
      height: 24,

      borderRadius: 12,

      backgroundColor: '#F59E0B',

      justifyContent: 'center',
      alignItems: 'center',

      borderWidth: 3,
      borderColor: '#FFF',
    },

    careLabelRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 6,
    },

    careLabel: {
      color: '#FFF',

      fontSize: 13,

      fontWeight: '800',

      marginLeft: 6,

      letterSpacing: 0.5,
    },

    careName: {
      color: '#FFF',

      fontSize: 34,

      fontWeight: '800',

      letterSpacing: -1,
    },

    card: {
      backgroundColor:
        'rgba(255,255,255,0.18)',

      borderRadius: 20,

      padding: 18,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 14,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.15)',
    },

    cardTitle: {
      color: '#FFF',

      fontSize: 18,

      fontWeight: '800',
    },

    cardSubtitle: {
      color: '#DDF8F2',

      marginTop: 4,

      fontSize: 15,

      fontWeight: '500',
    },
  });