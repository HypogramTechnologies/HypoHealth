import { useEffect, useState, useCallback, useRef } from 'react';

import { ComboOption } from '@/mobile/types/Outros/combo';

type UseComboError = {
  message: string;
};

export function useTipoMedicamentoCombo() {
  const [optionsTipoMedicamento, setOptions] =
    useState<ComboOption[]>([]);

  const [loadingTipoMedicamento, setLoading] =
    useState(false);

  const [errorTipoMedicamento, setError] =
    useState<UseComboError | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadTipoMedicamento =
    useCallback(async () => {
      if (!isMountedRef.current) return;

      setLoading(true);

      setError(null);

      try {
        const data: ComboOption[] = [
          {
            value: 'HORARIO_FIXO',
            label: 'Horário fixo',
          },

          {
            value: 'INTERVALO',
            label: 'Intervalo',
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
              'Erro ao carregar tipos',
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
    loadTipoMedicamento();
  }, [loadTipoMedicamento]);

  return {
    optionsTipoMedicamento,

    loadingTipoMedicamento,

    errorTipoMedicamento,

    recarregarTipoMedicamento:
      loadTipoMedicamento,
  };
}