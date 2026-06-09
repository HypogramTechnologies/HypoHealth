import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { AlertaItem } from '../../types/Outros/alerta';
import {
  RetiradaMedicamentoResponse,
  RetiradaMedicamentoService,
} from '../../services/retiradaMedicamentoService';
import { useAuth } from '../Auth/useAuth';

type Filters = {
  busca: string;
  dataFiltro?: Date;
  tipo: 'todos' | 'aviso' | 'info';
};

function mapAlerta(item: RetiradaMedicamentoResponse): AlertaItem {
  const medicamentoNome =
    item.agendamentoHorario?.agendamento?.medicamento?.nome ||
    'Medicamento';

  return {
    id: item.id,
    titulo: medicamentoNome,
    descricao: `Horário programado: ${dayjs(item.horario_programado).format('DD/MM/YYYY HH:mm')}`,
    dataHora: item.horario_programado,
    tipo: item.status === 'ATRASADO' ? 'aviso' : 'info',
  };
}

export function useAlerta(filters: Filters) {
  const [data, setData] = useState<AlertaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  const usuarioId = usuario?.usuario_proprietario_id;

  const fetchAlertas = useCallback(async () => {
    if (!usuarioId) {
      setData([]);
      return;
    }

    setLoading(true);

    try {
      const res = await RetiradaMedicamentoService.getAlertas(usuarioId);

      setData(res.map(mapAlerta));
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useFocusEffect(
    useCallback(() => {
      fetchAlertas();

      return () => {};
    }, [fetchAlertas]),
  );

  const filtrado = useMemo(() => {
    return data.filter(item => {
      const matchBusca = item.titulo
        .toLowerCase()
        .includes(filters.busca.toLowerCase());

      const matchDescricao = item.descricao
        ? item.descricao.toLowerCase().includes(filters.busca.toLowerCase())
        : false;

      const matchData = filters.dataFiltro
        ? dayjs(item.dataHora).isSame(filters.dataFiltro, 'day')
        : true;

      const matchTipo =
        filters.tipo === 'todos'
          ? true
          : item.tipo === filters.tipo;

      return (matchBusca || matchDescricao) && matchData && matchTipo;
    });
  }, [data, filters]);

  return { data: filtrado, loading, refetch: fetchAlertas };
}