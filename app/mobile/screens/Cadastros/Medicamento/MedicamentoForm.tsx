import React from 'react';
import { Text } from 'react-native';
import { Controller } from 'react-hook-form';

import { Form } from '../../../components/Form/Form';
import { InputField } from '../../../components/Form/InputField';

import { useTheme } from '../../../contexts/Theme/themeContext';
import { useStyles } from './styles';

import { SelectCard } from '../../../components/MedicamentoForm/SelectCard';
import { NumberSelector } from '../../../components/MedicamentoForm/NumberSelector';
import { ActionButton } from '../../../components/MedicamentoForm/ActionButton';
import { TimeField } from '../../../components/MedicamentoForm/TimeField';

import { useMedicamentoForm } from '../../../hooks/Medicamento/useMedicamentoForm';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { Row } from '@/mobile/components/Form/Row';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'MedicamentoForm'
>;

export function MedicamentoForm({ route }: Props) {
  const { mode, medicamentoId } = route.params;
  console.log('MedicamentoForm renderizado com mode:', mode, 'e medicamentoId:', medicamentoId);
  const { theme } = useTheme();
  const s = useStyles(theme);

  const {
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
  } = useMedicamentoForm(mode, medicamentoId);

  return (
    <Form loading={screen.loading}>
  
      <Controller
        control={control}
        name="medicamentoNome"
        render={({ field }) => (
          <InputField
            label="Nome do medicamento"
            placeholder="Losartana"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="medicamentoDescricao"
        render={({ field }) => (
          <InputField
            label="Descrição do medicamento"
            placeholder="Dor de cabeça, pílula azul..."
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />


      <Controller
        control={control}
        name="medicamentoDosagem"
        render={({ field }) => (
          <InputField
            label="Dosagem"
            placeholder="50mg"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={s.section}>Compartimentos</Text>

      <NumberSelector
        values={[1, 2, 3, 4, 5, 6, 7]}
        description={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
        selected={compartimentos}
        multiple
        onChange={toggleCompartimento}
      />

    
      <Text style={s.section}>Quando tomar</Text>

      <Row>
        <SelectCard
        title="Horário fixo"
        subtitle="8h, 14h, 20h"
        icon="time-outline"
        active={tipo === 'HORARIO_FIXO'}
        onPress={() => setValue('tipo', 'HORARIO_FIXO')}
      />

      <SelectCard
        title="De X em X horas"
        subtitle="Ex: 8h"
        icon="repeat-outline"
        active={tipo === 'INTERVALO'}
        onPress={() => setValue('tipo', 'INTERVALO')}
      />
      </Row>

    
      {tipo === 'INTERVALO' && (
        <>
          <Text style={s.section}>Intervalo</Text>

          <NumberSelector
            values={[4, 6, 8, 12]}
            selected={[intervalo || 8]}
            onChange={(v) => setValue('intervalo_horas', v)}
          />
        </>
      )}

      {/* Horários */}
      <Text style={s.section}>Horários</Text>

      {fields.map((item, index) => (
        <Controller
          key={item.id}
          control={control}
          name={`horarios.${index}.hora`}
          render={({ field }) => (
            <TimeField
              value={field.value}
              onChange={field.onChange}
              onRemove={
                tipo === 'HORARIO_FIXO' && fields.length > 1
                  ? () => remove(index)
                  : undefined
              }
            />
          )}
        />
      ))}

      {/* Adicionar horário */}
      {tipo === 'HORARIO_FIXO' && (
        <ActionButton
          title="Adicionar horário"
          icon="add"
          outlined
          onPress={() => append({ hora: '12:00' })}
        />
      )}

  
      <ActionButton
      
        title={mode === 'create' ? 'Salvar' : 'Atualizar'}
        icon="save-outline"
        onPress={handleSubmit(save)}
      />
    </Form>
  );
}