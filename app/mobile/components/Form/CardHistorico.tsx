import dayjs from 'dayjs';
import { HistoricoItem } from '../../types/Outros/historico';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { formatarHora } from '../../utils/formatar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/Theme/themeContext';

export function HistoricoCard({
  item,
  onReabrir,
  loading = false,
}: {
  item: HistoricoItem;
  onReabrir?: () => void | Promise<void>;
  loading?: boolean;
}) {
  const tomado = item.status === 'tomado';
  const podeReabrir =
    Boolean(onReabrir) &&
    item.status === 'nao_tomado' &&
    dayjs(item.dataHora).isSame(dayjs(), 'day');
  const { theme } = useTheme();
  return (
    <View
      style={{
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: tomado ? theme.colors.primary : theme.colors.error,
        backgroundColor: tomado
          ? 'rgba(76,175,80,0.1)'
          : 'rgba(244,67,54,0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        
  
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: tomado ? theme.colors.primary : theme.colors.error,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <MaterialCommunityIcons
            name={tomado ? 'check' : 'close'}
            size={18}
            color={theme.colors.text}
          />
        </View>

        {/* Texto */}
        <View>
          <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>
            {item.nome}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 12 }}>
            {formatarHora(item.dataHora)}
          </Text>
        </View>
      </View>

      {/* DIREITA */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            color: tomado ? theme.colors.primary : theme.colors.error,
            fontWeight: 'bold',
            fontSize: 12,
            marginRight: podeReabrir ? 8 : 0,
          }}
        >
          {tomado ? `Tomado ${item.horaTomado}` : 'Não tomado'}
        </Text>

        {podeReabrir ? (
          <TouchableOpacity
            onPress={onReabrir}
            disabled={loading}
            accessibilityLabel="Reabrir compartimento"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.text} />
            ) : (
              <MaterialCommunityIcons
                name="lock-open-variant"
                size={18}
                color={theme.colors.text}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}