import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/mobile/contexts/Theme/themeContext';

interface Props {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export function ResumoCard({ label, value, icon, color }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: 16,
        padding: 16,
        width: '48%'
      }}
    >
      <View
        style={{
          backgroundColor: `${color}20`,
          padding: 10,
          borderRadius: 10,
          alignSelf: 'flex-start',
          marginBottom: 10,
          
        }}
      >
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.colors.text,
        }}
      >
        {value}
      </Text>

      <Text style={{ color: theme.colors.destaque }}>{label}</Text>
    </View>
  );
}