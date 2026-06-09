import { useEffect, useState, useCallback, useRef } from 'react';

import { ComboOption } from '@/mobile/types/Outros/combo';

type UseComboError = {
  message: string;
};

export function useStatusMedicamentoCombo() {
  const [optionsStatusMedicamento, setOptions] =
    useState<ComboOption[]>([]);

  const [loadingStatusMedicamento, setLoading] =
    useState(false);

  const [errorStatusMedicamento, setError] =
    useState<UseComboError | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadStatusMedicamento =
    useCallback(async () => {
      if (!isMountedRef.current) return;

      setLoading(true);

      setError(null);

      try {
        const data: ComboOption[] = [
          {
            value: 'PENDENTE',
            label: 'Pendente',
          },

          {
            value: 'RETIRADO',
            label: 'Retirado',
          },

          {
            value: 'ATRASADO',
            label: 'Atrasado',
          },

          {
            value: 'NAO_RETIRADO',
            label: 'Não retirado',
          },
        ];

        if (isMountedRef.current) {
          setOptions(data);
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setError({
            message:
              err?.message ||
              'Erro ao carregar status',
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
    loadStatusMedicamento();
  }, [loadStatusMedicamento]);

  return {
    optionsStatusMedicamento,

    loadingStatusMedicamento,

    errorStatusMedicamento,

    recarregarStatusMedicamento:
      loadStatusMedicamento,
  };
}