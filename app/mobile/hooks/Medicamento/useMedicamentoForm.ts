import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { medicamentoSchema, MedicamentoFormData } from '../../schemas/medicamento.schema';
import { MedicamentoService } from '../../services/medicamentoService';
import { Mode } from '../../types/Outros/mode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useScreenMode } from '../Outros/useScreenMode';
import { MedicamentoDTO } from "@/mobile/types/Cadastros/medicamento";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function useMedicamentoForm(mode: Mode, medicamentoId?: string, navigation?: Navigation) {
  const screen = useScreenMode(mode);
  const { isCreate, setLoading } = screen;

  const form = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      medicamentoNome: '',
      medicamentoDosagem: '',
      medicamentoDescricao: '',
      medicamentoCriadoEm: '',
    },
  });

  const { control, handleSubmit, reset, formState: { errors } } = form;

  const saveAll = async (data: MedicamentoDTO) => {
  setLoading(true);
  try {
    if (isCreate) {
      await MedicamentoService.criar(data);
    } else if (medicamentoId) {
      await MedicamentoService.atualizar(medicamentoId, data);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!medicamentoId || isCreate) return;
    
    setLoading(true);
    MedicamentoService.buscarPorId(medicamentoId)
      .then(dados => reset(dados))
      .catch(error => {
          console.error("Erro ao carregar medicamento:", error);
       
      })
      .finally(() => setLoading(false));
  }, [medicamentoId, isCreate, reset, setLoading]);

  return {
    control,
    errors,
    screen,
    handleSubmit,
    saveAll,
  };
}