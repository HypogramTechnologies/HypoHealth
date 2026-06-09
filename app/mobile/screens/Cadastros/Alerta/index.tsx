import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { InputField } from '../../../components/Form/InputField';
import { DateField } from '../../../components/Form/InputDate';
import { AlertaCard } from '../../../components/Form/CardAlerta';

import { useAlerta } from '../../../hooks/Alerta/useAlerta';
import { useTheme } from '../../../contexts/Theme/themeContext';
import { RetiradaMedicamentoService } from '../../../services/retiradaMedicamentoService';

type FilterForm = {
  busca: string;
  dataFiltro?: Date;
  tipo: 'todos' | 'aviso' | 'info';
};

export function Alerta() {
  const { theme } = useTheme();
  const [reabrindoId, setReabrindoId] = useState<string | null>(null);

  const { control, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      busca: '',
      tipo: 'todos',
      dataFiltro: undefined,
    },
  });

  const busca = watch('busca');
  const dataFiltro = watch('dataFiltro');
  const tipo = watch('tipo');

  const { data, refetch } = useAlerta({
    busca,
    dataFiltro,
    tipo,
  });

  const handleReabrir = async (retiradaId: string) => {
    try {
      setReabrindoId(retiradaId);
      await RetiradaMedicamentoService.reabrirRetirada(retiradaId);
      await refetch();
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error
          ? error.message
          : 'Não foi possível reabrir o compartimento.',
      );
    } finally {
      setReabrindoId(null);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: theme.colors.background }}>
      
      {/* TÍTULO */}
      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 10,
        color: theme.colors.text,
      }}>
        Alertas
      </Text>

      {/* FILTROS */}
      <View style={{ paddingHorizontal: 16 }}>
        
        <InputField
          label="Buscar alerta"
          placeholder="Pesquisar..."
          icon="magnify"
          value={busca}
          onChangeText={(text) => setValue('busca', text)}
        />

        <DateField
          name="dataFiltro"
          label="Filtrar por data"
          control={control}
          errors={{}}
        />

        {/* TIPOS */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          {[
            { label: 'Todos', value: 'todos' },
            { label: 'Aviso', value: 'aviso' },
            { label: 'Info', value: 'info' },
          ].map(item => {
            const active = tipo === item.value;

            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setValue('tipo', item.value as any)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: active
                    ? theme.colors.primary
                    : theme.colors.backgroundCard,
                }}
              >
                <Text style={{
                  fontWeight: 'bold',
                  color: theme.colors.text,
                }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LIMPAR */}
        <TouchableOpacity
          onPress={() => {
            setValue('busca', '');
            setValue('tipo', 'todos');
            setValue('dataFiltro', undefined);
          }}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 10,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
            Limpar filtros
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <AlertaCard
            item={item}
            onReabrir={() => handleReabrir(item.id)}
            loading={reabrindoId === item.id}
          />
        )}
      />
    </View>
  );
}