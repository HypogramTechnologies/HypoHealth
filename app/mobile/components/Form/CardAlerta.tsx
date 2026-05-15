import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/Theme/themeContext';
import { formatarData } from '../../utils/formatar';
import { AlertaItem } from '../../types/Outros/alerta';

// 🔥 Tipo correto dos ícones
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// 🔥 Config tipado (UMA VEZ só)
const ALERT_CONFIG: Record<
  AlertaItem['tipo'],
  {
    color: string;
    bg: string;
    icon: IconName;
  }
> = {
  erro: {
    color: '#F44336',
    bg: 'rgba(244,67,54,0.1)',
    icon: 'alert-circle',
  },
  aviso: {
    color: '#FF9800',
    bg: 'rgba(255,152,0,0.1)',
    icon: 'alert',
  },
  info: {
    color: '#2196F3',
    bg: 'rgba(33,150,243,0.1)',
    icon: 'bell',
  },
};

export function AlertaCard({ item }: { item: AlertaItem }) {
  const { theme } = useTheme();

  // 🔥 Usa o config correto
  const config = ALERT_CONFIG[item.tipo];

  return (
    <View
      style={{
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: config.color,
        backgroundColor: config.bg,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Ícone */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: config.color,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <MaterialCommunityIcons
          name={config.icon}
          size={20}
          color="#fff"
        />
      </View>

      {/* Texto */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: theme.colors.text,
          }}
        >
          {item.titulo}
        </Text>

        <Text
          style={{
            color: theme.colors.detail,
            marginTop: 2,
          }}
        >
          {formatarData(item.dataHora)}
        </Text>
      </View>
    </View>
  );
}