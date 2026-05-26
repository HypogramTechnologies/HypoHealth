import React from 'react';

import {
  Text,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Controller,
} from 'react-hook-form';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { Form } from '../../../components/Form/Form';

import { InputField } from '../../../components/Form/InputField';

import { Row } from '@/mobile/components/Form/Row';

import { SelectCard } from '../../../components/MedicamentoForm/SelectCard';

import { NumberSelector } from '../../../components/MedicamentoForm/NumberSelector';

import { ActionButton } from '../../../components/MedicamentoForm/ActionButton';
import { DateField } from '../../../components/Form/InputDate';
import { TimeField } from '../../../components/MedicamentoForm/TimeField';

import { useTheme } from '../../../contexts/Theme/themeContext';

import { useStyles } from './styles';

import { useMedicamentoForm } from '../../../hooks/Medicamento/useMedicamentoForm';

import { RootStackParamList } from '../../../navigation/types';

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    'MedicamentoForm'
  >;

export function MedicamentoForm({
  route,
}: Props) {
  const {
    mode,
    medicamentoId,
  } = route.params;

  const navigation =
    useNavigation();

  const { theme } =
    useTheme();

  const s = useStyles(theme);

  const {
    control,

    handleSubmit,

    save,

    tipo,

    intervalo,

    compartimentos,

    compartimentosDisponiveis,

    horarios,

    addHorario,

    removeHorario,

    updateHorario,

    setValue,

    toggleCompartimento,

    errors,

    screen,
  } = useMedicamentoForm(
    mode,
    medicamentoId,
  );

  async function handleSave(
    data: any,
  ) {
    
    const success =
      await save(data);

    if (success) {
      navigation.goBack();
    }
  }

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
            onChangeText={
              field.onChange
            }
            error={
              errors
                .medicamentoNome
                ?.message
            }
          />
        )}
      />

      <Controller
        control={control}
        name="medicamentoDescricao"
        render={({ field }) => (
          <InputField
            label="Descrição do medicamento"
            placeholder="Dor de cabeça..."
            value={field.value}
            onChangeText={
              field.onChange
            }
            error={
              errors
                .medicamentoDescricao
                ?.message
            }
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
            onChangeText={
              field.onChange
            }
            error={
              errors
                .medicamentoDosagem
                ?.message
            }
          />
        )}
      />

      <DateField
        control={control}
        name="data_inicio"
        label="Data de início"
        errors={errors}
      />

      <DateField
        control={control}
        name="data_fim"
        label="Data de fim"
        errors={errors}
      />

      <Text style={s.section}>
        Compartimentos
      </Text>

      <NumberSelector
        values={compartimentosDisponiveis.map(
          item => item.id,
        )}
        title={compartimentosDisponiveis.map(
          item =>
            String(item.posicao),
        )}
        description={compartimentosDisponiveis.map(
          item =>
            item.dia_semana,
        )}
        selected={compartimentos}
        multiple
        onChange={
          toggleCompartimento
        }
      />

      {errors.compartimentos && (
        <Text style={s.error}>
          {
            errors
              .compartimentos
              .message
          }
        </Text>
      )}

      <Text style={s.section}>
        Quando tomar
      </Text>

      <Row>
        <SelectCard
          title="Horário fixo"
          subtitle="8h, 14h..."
          icon="time-outline"
          active={
            tipo ===
            'HORARIO_FIXO'
          }
          onPress={() =>
            setValue(
              'tipo',
              'HORARIO_FIXO',
            )
          }
        />

        <SelectCard
          title="De X em X horas"
          subtitle="Ex: 8h"
          icon="repeat-outline"
          active={
            tipo ===
            'INTERVALO'
          }
          onPress={() =>
            setValue(
              'tipo',
              'INTERVALO',
            )
          }
        />
      </Row>

      {tipo ===
        'INTERVALO' && (
        <>
          <Text style={s.section}>
            Intervalo
          </Text>

          <NumberSelector
            values={[
              4,
              6,
              8,
              12,
            ]}
            title={[
              '4',
              '6',
              '8',
              '12',
            ]}
            selected={[
              intervalo || 8,
            ]}
            onChange={v =>
              setValue(
                'intervalo_horas',
                Number(v),
              )
            }
          />
        </>
      )}

      <Text style={s.section}>
        Horários
      </Text>

      {horarios.map(
  (hora, index) => (
    <TimeField
      key={index}
      value={hora}
      onChange={value =>
        updateHorario(
          index,
          value,
        )
      }
      onRemove={
        tipo ===
          'HORARIO_FIXO' &&
        horarios.length > 1
          ? () =>
              removeHorario(
                index,
              )
          : undefined
      }
      error={
        errors.horarios?.[
          index
        ]?.message as
          | string
          | undefined
      }
    />
  ),
)}

      {tipo ===
        'HORARIO_FIXO' && (
        <ActionButton
          title="Adicionar horário"
          icon="add"
          outlined
          onPress={() =>
            addHorario(
              '12:00',
            )
          }
        />
      )}

      <ActionButton
        title={
          mode === 'create'
            ? 'Salvar'
            : 'Atualizar'
        }
        icon="save-outline"
        onPress={handleSubmit(
          handleSave,
        )}
      />
    </Form>
  );
}