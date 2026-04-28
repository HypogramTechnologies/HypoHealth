import { useEffect, useState } from 'react';
import { AlunoService } from '../../services/medicamentoService';

interface ComboOption {
  label: string;
  value: string;
}

// Mock temporário seguindo a interface ideal
const MOCK: ComboOption[] = [
  { label: 'Ana Paula', value: '1' },
  { label: 'Carlos Silva', value: '2' },
  { label: 'Mariana Santos', value: '3' },
  { label: 'Pedro Oliveira', value: '4' },
];

export function useAlunoCombo() {
  const [optionsAlunos, setOptions] = useState<ComboOption[]>([]);
  const [loadingAlunos, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Tentativa de buscar da API
        const data = await AlunoService.buscarCombo();

        const mapped = data.map((c) => ({
          value: c.value,
          label: c.label,
        }));

        setOptions(mapped);
      } catch (error) {
        console.warn("Usando dados de mock (Falha na API ou ambiente local)", error);
        // Em caso de erro (ou enquanto a API não existe), injetamos o mock
        setOptions(MOCK);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { optionsAlunos, loadingAlunos };
}