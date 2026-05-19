import { TouchableOpacity, Text, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/Theme/themeContext';

interface Props {
  label: string;
  onPress: (event: GestureResponderEvent) => void | Promise<void>;
  loading?: boolean;
}

export function SubmitButton({ label, onPress, loading }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <Text
          style={{
            color: theme.colors.text,
            marginLeft: 8,
            fontSize: theme.sizes.mediumText.fontSize,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}