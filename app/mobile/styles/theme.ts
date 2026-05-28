export const lightTheme = {
  mode: 'light',

  colors: {
    background: '#F3F4F6',
    surface: '#FFFFFF',

    primary: '#129B83',
    detail: '#1BB39A',
    destaque: '#0E7A67',
    destaque_amarelo: '#F59E0B',
    text: '#0F172A',
    textInverted: '#FFFFFF',

    // AJUSTADO
    opaco: '#6B7280',

    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B',

    activeTab: '#DDF6F1',

    // AJUSTADO
    inactiveTab: '#9CA3AF',

    // AJUSTADO
    backgroundCard: '#FFFFFF',
    backgroundCardDestaque: '#129B8315',

    space: '#E5E7EB',
    backgroundStatus: '#00000010',

    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    border: '#E5E7EB',
    divider: '#D1D5DB',

    icon: '#129B83',
    iconBackground: '#129B83',

    cardDone: '#EEF9F4',
    cardDoneBorder: '#B7E7C7',
    doneText: '#16A34A',

    buttonText: '#FFFFFF',
    placeholder: '#9CA3AF',

    overlay: '#00000020',
    shadow: '#00000015',
  },

  sizes: {
    iconSize: 30,
    iconSizeCard: 16,
    iconSizeValueCard: 18,
    iconSizeSmall: 14,
    iconSizeMedium: 22,
    iconSizeLarge: 36,

    header: { fontSize: 56, fontWeight: '700' },
    subHeader: { fontSize: 32, fontWeight: '600' },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
    subtitle: { fontSize: 20, fontWeight: '500' },
    secundario: { fontSize: 18 },
    text: { fontSize: 16 },
    smallText: { fontSize: 14 },
    mediumText: { fontSize: 16 },
    largeText: { fontSize: 22 },

    inputHeight: { height: 48 },
    buttonHeight: { height: 48 },
    cardHeight: { minHeight: 72 },
    headerHeight: { minHeight: 220 },

    paddingSmall: 8,
    paddingMedium: 12,
    paddingLarge: 16,
    paddingXLarge: 24,

    marginSmall: 8,
    marginMedium: 12,
    marginLarge: 16,

    radiusSmall: 8,
    radiusMedium: 12,
    radiusLarge: 18,
    radiusXLarge: 28,
    radiusFull: 999,
  },
} as const;



export const darkTheme = {
  mode: 'dark',

  colors: {
    background: '#121212',
    surface: '#181818',

    primary: '#129B83',
    detail: '#1BB39A',
    destaque: '#0E7A67',
    destaque_amarelo: '#F59E0B',
    text: '#F8FAFC',
    textInverted: '#0F172A',

    // AJUSTADO
    opaco: '#A1A1AA',

    success: '#22C55E',
    error: '#EF4444',
    warning: '#FBBF24',

    activeTab: '#163A34',

    // AJUSTADO
    inactiveTab: '#6B7280',

    // AJUSTADO
    backgroundCard: '#1C1C1C',
    backgroundCardDestaque: '#129B8325',

    space: '#2A2A2A',
    backgroundStatus: '#FFFFFF10',

    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',

    border: '#2A2A2A',
    divider: '#3A3A3A',

    icon: '#34D399',
    iconBackground: '#134E4A',

    cardDone: '#17362F',
    cardDoneBorder: '#166534',
    doneText: '#4ADE80',

    buttonText: '#FFFFFF',
    placeholder: '#71717A',

    overlay: '#00000040',
    shadow: '#00000030',
  },

  sizes: {
    iconSize: 30,
    iconSizeCard: 16,
    iconSizeValueCard: 18,
    iconSizeSmall: 14,
    iconSizeMedium: 22,
    iconSizeLarge: 36,

    header: { fontSize: 56, fontWeight: '700' },
    subHeader: { fontSize: 32, fontWeight: '600' },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
    subtitle: { fontSize: 20, fontWeight: '500' },
    secundario: { fontSize: 18 },
    text: { fontSize: 16 },
    smallText: { fontSize: 14 },
    mediumText: { fontSize: 16 },
    largeText: { fontSize: 22 },

    inputHeight: { height: 48 },
    buttonHeight: { height: 48 },
    cardHeight: { minHeight: 72 },
    headerHeight: { minHeight: 220 },

    paddingSmall: 8,
    paddingMedium: 12,
    paddingLarge: 16,
    paddingXLarge: 24,

    marginSmall: 8,
    marginMedium: 12,
    marginLarge: 16,

    radiusSmall: 8,
    radiusMedium: 12,
    radiusLarge: 18,
    radiusXLarge: 28,
    radiusFull: 999,
  },
} as const;