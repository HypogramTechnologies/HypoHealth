import { useState, useCallback } from 'react';
import { AlunoService } from '../../services/medicamentoService';
import { type AlunoFiltro, Aluno } from '../../types/aluno';

export function useCarteira() {
  
  const [dados, setDados] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarCarteira = useCallback(
    async (filtros?: AlunoFiltro) => {
      setLoading(true);

      try {
        const response = await AlunoService.buscarTodas(filtros);

        const alunos = Array.isArray(response) ? response : [];

        setDados(alunos);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        setDados([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAluno = useCallback(
    async (alunoId: string) => {
      setLoading(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // await AlunoService.excluir(alunoId);

        setDados(prev =>
          Array.isArray(prev)
            ? prev.filter(a => a.alunoId !== alunoId)
            : []
        );

      } catch (error) {
        console.error("Erro ao deletar:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    dados,
    loading,
    buscarCarteira,
    deleteAluno
  };
}