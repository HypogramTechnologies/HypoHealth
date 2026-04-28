import { useState, useCallback, useRef, useEffect } from 'react';
import { MedicamentoService } from '../../services/medicamentoService';
import { type MedicamentoFiltro, Medicamento } from '../../types/Cadastros/medicamento';

type UseCarteiraError = {
  message: string;
  code?: string;
};

export function useCarteira() {
  const [dados, setDados] = useState<Medicamento[]>([]);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<UseCarteiraError | null>(null);


  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetState = (fn: () => void) => {
    if (isMountedRef.current) fn();
  };

  const buscarCarteira = useCallback(async (filtros?: MedicamentoFiltro) => {
    const requestId = ++requestIdRef.current;

    safeSetState(() => {
      setLoadingBusca(true);
      setError(null);
    });

    try {
      const response = await MedicamentoService.getAll(filtros);

      if (requestId !== requestIdRef.current) return;

      const medicamentos = Array.isArray(response) ? response : [];

      safeSetState(() => {
        setDados(medicamentos);
      });
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;

      console.error("Erro ao buscar medicamentos:", err);

      safeSetState(() => {
        setError({
          message: err?.message || "Erro ao buscar medicamentos",
          code: err?.code,
        });
        setDados([]);
      });
    } finally {
      if (requestId === requestIdRef.current) {
        safeSetState(() => setLoadingBusca(false));
      }
    }
  }, []);

  const deleteMedicamento = useCallback(async (medicamentoId: string) => {
    safeSetState(() => {
      setLoadingDelete(true);
      setError(null);
    });

    let previousData: Medicamento[] = [];

    safeSetState(() => {
      setDados(prev => {
        previousData = prev;
        return prev.filter(m => m.medicamentoId !== medicamentoId);
      });
    });

    try {
      await MedicamentoService.delete(medicamentoId);
    } catch (err: any) {
      console.error("Erro ao deletar medicamento:", err);

      safeSetState(() => {
        setDados(previousData);
        setError({
          message: err?.message || "Erro ao deletar medicamento",
          code: err?.code,
        });
      });

      throw err;
    } finally {
      safeSetState(() => setLoadingDelete(false));
    }
  }, []);

  return {
    dados,
    loadingBusca,
    loadingDelete,
    error,
    buscarCarteira,
    deleteMedicamento,
  };
}