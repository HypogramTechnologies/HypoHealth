import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { medicamentoSchema, MedicamentoFormData } from '../../schemas/medicamento.schema';
import { MedicamentoService } from '../../services/medicamentoService';
import { Mode } from '../../types/Outros/mode';
import { useScreenMode } from '../Outros/useScreenMode';

export function useMedicamentoForm(mode: Mode, medicamentoId?: string) {
  const screen = useScreenMode(mode);
  const { isCreate, setLoading } = screen;

  const form = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      medicamentoNome: '',
      medicamentoDosagem: '',
      medicamentoDescricao: '',
      compartimentos: [],
      tipo: 'HORARIO_FIXO',
      intervalo_horas: 8,
      horarios: [{ hora: '08:00' }],
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = form;

  // FieldArray
  const horariosArray = useFieldArray({
    control,
    name: 'horarios',
  });

  const { fields, append, remove, replace } = horariosArray;

  // 🔹 Estados derivados
  const tipo = watch('tipo');
  const compartimentos = watch('compartimentos');
  const intervalo = watch('intervalo_horas');

  // 🔹 Regras de negócio
  const toggleCompartimento = (value: number) => {
    const lista = compartimentos || [];

    setValue(
      'compartimentos',
      lista.includes(value)
        ? lista.filter(x => x !== value)
        : [...lista, value]
    );
  };

  const gerarHorarios = (inicio = '08:00', h = 8) => {
    const [hora, min] = inicio.split(':').map(Number);
    const total = Math.floor(24 / h);

    const lista = [];

    for (let i = 0; i < total; i++) {
      const nova = (hora + i * h) % 24;

      lista.push({
        hora: `${String(nova).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      });
    }

    replace(lista);
  };

  useEffect(() => {
    if (tipo === 'INTERVALO') {
      gerarHorarios(fields[0]?.hora, intervalo);
    }
  }, [tipo, intervalo]);

  const save = async (data: MedicamentoFormData) => {
    setLoading(true);

    try {
      if (isCreate) {
        await MedicamentoService.create(data);
      } else if (medicamentoId) {
        await MedicamentoService.update(medicamentoId, data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!medicamentoId || isCreate) return;

    setLoading(true);

    MedicamentoService.getById(medicamentoId)
      .then(reset)
      .finally(() => setLoading(false));
  }, [medicamentoId, isCreate, reset, setLoading]);

  return {
    
    control,
    handleSubmit,
    save,

    tipo,
    intervalo,
    compartimentos,

    fields,
    append,
    remove,

  
    setValue,
    toggleCompartimento,
     screen,
  };
}