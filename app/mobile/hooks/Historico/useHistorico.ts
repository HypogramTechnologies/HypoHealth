import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
// import { HistoricoService } from '../../services/historicoService';
import { HistoricoItem } from '../../types/Outros/historico';

type Filters = {
  busca: string;
  dataFiltro?: Date;
  status: 'todos' | 'tomado' | 'nao_tomado';
};

export function useHistorico(filters: Filters) {
  const [data, setData] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistorico();
  }, []);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      // const res = await HistoricoService.getAll();
      const res: HistoricoItem[] = [
        {
          nome: "Buscopam",
          dataHora: "2024-06-01",
          status: "tomado",
          id: "1",
        },
        {
          nome: "Buscopam",
          dataHora: "2024-06-01",
          status: "nao_tomado",
          id: "2",
        },
        {
          nome: "Buscopam",
          dataHora: "2024-06-02",
          status: "nao_tomado",
          id: "3",
        },
      ];
      setData(res);
    } finally {
      setLoading(false);
    }
  };

 
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
  };
}