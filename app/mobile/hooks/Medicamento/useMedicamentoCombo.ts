import { useEffect, useState, useCallback, useRef } from 'react';
import { MedicamentoService } from '../../services/medicamentoService';
import { ComboOption } from '@/mobile/types/Outros/combo';

type UseMedicamentoComboError = {
  message: string;
};

export function useMedicamentoCombo() {
  const [optionsMedicamentos, setOptions] = useState<ComboOption[]>([]);
  const [loadingMedicamentos, setLoading] = useState(false);
  const [errorMedicamentos, setError] = useState<UseMedicamentoComboError | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadMedicamentos = useCallback(async () => {
    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const data = await MedicamentoService.buscarCombo();

      const mapped: ComboOption[] = Array.isArray(data)
        ? data.map((c) => ({
            value: c.value,
            label: c.label,
          }))
        : [];

      if (isMountedRef.current) {
        setOptions(mapped);
      }
    } catch (err: any) {
      console.error("Erro ao carregar combo de medicamentos:", err);

      if (isMountedRef.current) {
        setError({
          message: err?.message || "Erro ao carregar medicamentos",
        });

        setOptions([]);

      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadMedicamentos();
  }, [loadMedicamentos]);

  return {
    optionsMedicamentos,
    loadingMedicamentos,
    errorMedicamentos,
    recarregarMedicamentos: loadMedicamentos,
  };
}