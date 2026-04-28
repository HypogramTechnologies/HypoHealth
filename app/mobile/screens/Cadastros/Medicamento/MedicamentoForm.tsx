
import React, { useEffect } from 'react';
import {
  Text,
} from 'react-native';

import {
  useForm,
  Controller,
  useFieldArray,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  medicamentoSchema,
  MedicamentoFormData,
} from '../../../schemas/medicamento.schema';

import { Form } from '../../../components/Form/Form';
import { InputField } from '../../../components/Form/InputField';

import { useTheme } from '../../../contexts/Theme/themeContext';
import { useStyles } from './styles';

import { SelectCard } from '../../../components/MedicamentoForm/SelectCard';
import { NumberSelector } from '../../../components/MedicamentoForm/NumberSelector';
import { ActionButton } from '../../../components/MedicamentoForm/ActionButton';
import { TimeField } from '../../../components/MedicamentoForm/TimeField';

export function MedicamentoForm() {
  const { theme } = useTheme();
  const s = useStyles(theme);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } =
    useForm<MedicamentoFormData>({
      resolver: zodResolver(
        medicamentoSchema
      ),
      defaultValues: {
        medicamentoNome: '',
        medicamentoDosagem:
          '',
        medicamentoDescricao:
          '',
        compartimentos: [],
        tipo: 'HORARIO_FIXO',
        intervalo_horas: 8,
        horarios: [
          { hora: '08:00' },
        ],
      },
    });

  const {
    fields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: 'horarios',
  });

  const tipo = watch('tipo');
  const gavetas =
    watch('compartimentos');
  const intervalo =
    watch('intervalo_horas');

  function toggleBox(
    value: number
  ) {
    setValue(
      'compartimentos',
      gavetas.includes(value)
        ? gavetas.filter(
            x => x !== value
          )
        : [...gavetas, value]
    );
  }

  function gerar(
    inicio = '08:00',
    h = 8
  ) {
    const [hora, min] =
      inicio
        .split(':')
        .map(Number);

    const total =
      Math.floor(24 / h);

    const lista = [];

    for (
      let i = 0;
      i < total;
      i++
    ) {
      const nova =
        (hora + i * h) % 24;

      lista.push({
        hora: `${String(
          nova
        ).padStart(
          2,
          '0'
        )}:${String(
          min
        ).padStart(2, '0')}`,
      });
    }

    replace(lista);
  }

  useEffect(() => {
    if (
      tipo ===
      'INTERVALO'
    ) {
      gerar(
        fields[0]?.hora,
        intervalo
      );
    }
  }, [tipo, intervalo]);

  function submit(
    data: MedicamentoFormData
  ) {
    console.log(data);
  }

  return (
    <Form>
      <Controller
        control={control}
        name="medicamentoNome"
        render={({
          field,
        }) => (
          <InputField
            label="Nome do medicamento"
            placeholder="Losartana"
            value={
              field.value
            }
            onChangeText={
              field.onChange
            }
          />
        )}
      />

      <Controller
        control={control}
        name="medicamentoDescricao"
        render={({
          field,
        }) => (
          <InputField
            label="Descrição do medicamento"
            placeholder="Dor de cabeça, pílula azul, branca e amarela"
            value={
              field.value
            }
            onChangeText={
              field.onChange
            }
          />
        )}
      />

      <Controller
        control={control}
        name="medicamentoDosagem"
        render={({
          field,
        }) => (
          <InputField
            label="Dosagem"
            placeholder="50mg"
            value={
              field.value
            }
            onChangeText={
              field.onChange
            }
          />
        )}
      />

      <Text style={s.section}>
        Compartimentos
      </Text>

      <NumberSelector
        values={[
          1,2,3,4,5,6,7,
        ]}
        selected={gavetas}
        multiple
        onChange={toggleBox}
      />

      <Text style={s.section}>
        Como tomar?
      </Text>

      <SelectCard
        title="Horário fixo"
        subtitle="8h, 14h, 20h"
        icon="time-outline"
        active={
          tipo ===
          'HORARIO_FIXO'
        }
        onPress={() =>
          setValue(
            'tipo',
            'HORARIO_FIXO'
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
            'INTERVALO'
          )
        }
      />

      {tipo ===
        'INTERVALO' && (
        <>
          <Text
            style={
              s.section
            }
          >
            Intervalo
          </Text>

          <NumberSelector
            values={[
              4,6,8,12,
            ]}
            selected={[
              intervalo ||
                8,
            ]}
            onChange={v =>
              setValue(
                'intervalo_horas',
                v
              )
            }
          />
        </>
      )}

      <Text style={s.section}>
        Horários
      </Text>

      {fields.map(
        (
          item,
          index
        ) => (
          <Controller
            key={
              item.id
            }
            control={
              control
            }
            name={`horarios.${index}.hora`}
            render={({
              field,
            }) => (
              <TimeField
                value={
                  field.value
                }
                onChange={
                  field.onChange
                }
                onRemove={
                  tipo ===
                    'HORARIO_FIXO' &&
                  fields.length >
                    1
                    ? () =>
                        remove(
                          index
                        )
                    : undefined
                }
              />
            )}
          />
        )
      )}

      {tipo ===
        'HORARIO_FIXO' && (
        <ActionButton
          title="Adicionar horário"
          icon="add"
          outlined
          onPress={() =>
            append({
              hora: '12:00',
            })
          }
        />
      )}

      <ActionButton
        title="Salvar"
        icon="save-outline"
        onPress={handleSubmit(
          submit
        )}
      />
    </Form>
  );
}
