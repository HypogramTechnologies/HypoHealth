import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { HistoricoItem } from '../../types/Outros/historico';
import {
  RetiradaMedicamentoResponse,
  RetiradaMedicamentoService,
} from '../../services/retiradaMedicamentoService';
import { useAuth } from '../Auth/useAuth';
import { formatarHora } from '../../utils/formatar';

type Filters = {
  busca: string;
  dataFiltro?: Date;
  status: 'todos' | 'tomado' | 'nao_tomado';
};

function mapHistorico(
  item: RetiradaMedicamentoResponse,
): HistoricoItem {
  const medicamentoNome =
    item.agendamentoHorario?.agendamento?.medicamento?.nome ||
    'Medicamento';

  return {
    id: item.id,
    nome: medicamentoNome,
    dataHora: item.horario_programado,
    status: item.status === 'RETIRADO' ? 'tomado' : 'nao_tomado',
    horaTomado: item.horario_retirada
      ? formatarHora(item.horario_retirada)
      : undefined,
  };
}

export function useHistorico(filters: Filters) {
  const [data, setData] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  const usuarioId = usuario?.usuario_proprietario_id;

  const fetchHistorico = useCallback(async () => {
    if (!usuarioId) {
      setData([]);
      return;
    }

    setLoading(true);

    try {
      const res = await RetiradaMedicamentoService.getHistorico(usuarioId);

      setData(res.map(mapHistorico));
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useFocusEffect(
    useCallback(() => {
      fetchHistorico();

      return () => {};
    }, [fetchHistorico]),
  );

 
  const filtrado = useMemo(() => {
    return data.filter(item => {
      const matchNome = item.nome
        .toLowerCase()
        .includes(filters.busca.toLowerCase());

      const matchData = filters.dataFiltro
        ? dayjs(item.dataHora).isSame(filters.dataFiltro, 'day')
        : true;

      const matchStatus =
        filters.status === 'todos'
          ? true
          : item.status === filters.status;

      return matchNome && matchData && matchStatus;
    });
  }, [data, filters]);

  // 🔥 AGRUPAMENTO
  const grouped = useMemo(() => {
    const groups: Record<string, HistoricoItem[]> = {};

    filtrado.forEach(item => {
      const date = dayjs(item.dataHora).format('YYYY-MM-DD');

      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });

    return groups;
  }, [filtrado]);

  const dates = Object.keys(grouped).sort((a, b) =>
    dayjs(b).unix() - dayjs(a).unix()
  );

  return {
    grouped,
    dates,
    loading,
    refetch: fetchHistorico,
  };
}