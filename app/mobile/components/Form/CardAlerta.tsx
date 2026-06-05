import dayjs from 'dayjs';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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

export function AlertaCard({
  item,
  onReabrir,
  loading = false,
}: {
  item: AlertaItem;
  onReabrir?: () => void | Promise<void>;
  loading?: boolean;
}) {
  const { theme } = useTheme();

  // 🔥 Usa o config correto
  const config = ALERT_CONFIG[item.tipo];
  const podeReabrir =
    Boolean(onReabrir) &&
    item.tipo === 'aviso' &&
    dayjs(item.dataHora).isSame(dayjs(), 'day');

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

      {podeReabrir ? (
        <TouchableOpacity
          onPress={onReabrir}
          disabled={loading}
          accessibilityLabel="Reabrir compartimento"
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 44,
            marginLeft: 12,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <MaterialCommunityIcons
              name="lock-open-variant"
              size={20}
              color={theme.colors.text}
            />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}