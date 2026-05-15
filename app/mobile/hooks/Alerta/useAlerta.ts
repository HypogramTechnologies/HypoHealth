import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { AlertaItem } from '../../types/Outros/alerta';
// import { AlertaService } from '../../services/alertaService';

type Filters = {
  busca: string;
  dataFiltro?: Date;
  tipo: 'todos' | 'erro' | 'aviso' | 'info';
};

export function useAlerta(filters: Filters) {
  const [data, setData] = useState<AlertaItem[]>([]);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    // const res = await AlertaService.getAll();
    const res: AlertaItem[] = [
      {
        id: "1",
        titulo: "Alerta de medicação",
        descricao: "Nível de glicose abaixo de 70 mg/dL",
        dataHora: "2024-06-01T08:30:00",
        tipo: "aviso"
      }]
    setData(res);
  };

  const filtrado = useMemo(() => {
    return data.filter(item => {
      const matchBusca = item.titulo
        .toLowerCase()
        .includes(filters.busca.toLowerCase());

      const matchData = filters.dataFiltro
        ? dayjs(item.dataHora).isSame(filters.dataFiltro, 'day')
        : true;

      const matchTipo =
        filters.tipo === 'todos'
          ? true
          : item.tipo === filters.tipo;

      return matchBusca && matchData && matchTipo;
    });
  }, [data, filters]);

  return { data: filtrado };
}