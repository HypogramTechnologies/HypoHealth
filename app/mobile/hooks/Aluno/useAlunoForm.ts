import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { alunoSchema, AlunoFormData } from '../../../src/schemas/aluno.schema';
import { AlunoService } from '../../../src/services/alunoService';
import { Mode } from '../../types/Outros/mode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useScreenMode } from '../../hooks/useScreenMode';
import { useCursoCombo } from '../Curso/useCursoCombo'; 

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function useAlunoForm(mode: Mode, alunoId?: string, navigation?: Navigation) {
  const screen = useScreenMode(mode);
  const { isCreate, setLoading } = screen;

  const { optionsCursos, loadingCursos } = useCursoCombo();

  const form = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      alunoNome: '',
      alunoMatricula: '',
      cursoId: '',
      alunoEmail: '',
      alunoTelefone: '',
      alunoCep: '',
      alunoEndereco: '',
      alunoCidade: '',
      alunoEstado: '',
    },
  });

  const { control, handleSubmit, reset, formState: { errors } } = form;

  const saveAll = async (data: AlunoFormData) => {
  setLoading(true);
  try {
    if (isCreate) {
      await AlunoService.criar(data);
    } else if (alunoId) {
      await AlunoService.atualizar(alunoId, data);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!alunoId || isCreate) return;
    
    setLoading(true);
    AlunoService.buscarPorId(alunoId)
      .then(dados => reset(dados))
      .catch(error => {
          console.error("Erro ao carregar aluno:", error);
       
      })
      .finally(() => setLoading(false));
  }, [alunoId, isCreate, reset, setLoading]);

  return {
    control,
    errors,
    screen,
    optionsCursos,
    loadingCursos,
    handleSubmit,
    saveAll,
  };
}