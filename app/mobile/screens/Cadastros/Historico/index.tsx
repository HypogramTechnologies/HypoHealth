import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { useForm } from 'react-hook-form';

import { useHistorico } from '../../../hooks/Historico/useHistorico';
import { formatarData } from '../../../utils/formatar';

import { HistoricoCard } from '../../../components/Form/CardHistorico';
import { InputField } from '../../../components/Form/InputField';
import { DateField } from '../../../components/Form/InputDate';
import { useTheme } from '../../../contexts/Theme/themeContext';

type FilterForm = {
  busca: string;
  dataFiltro?: Date;
  status: 'todos' | 'tomado' | 'nao_tomado';
};

export function Historico() {
  const { control, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      busca: '',
      status: 'todos',
      dataFiltro: undefined,
    },
  });
  const { theme } = useTheme();
  const busca = watch('busca');
  const dataFiltro = watch('dataFiltro');
  const status = watch('status');

  const { grouped, dates } = useHistorico({
    busca,
    dataFiltro,
    status,
  });

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: theme.colors.background }}>
      
      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 10,
        color: theme.colors.text,
      }}>
        Histórico
      </Text>

      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        
   
        <InputField
          label="Buscar medicamento"
          placeholder='Pesquisar...'
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

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          {[
            { label: 'Todos', value: 'todos' },
            { label: 'Tomados', value: 'tomado' },
            { label: 'Não tomados', value: 'nao_tomado' },
          ].map(item => {
            const active = status === item.value;

            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setValue('status', item.value as any)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: active ? theme.colors.primary : theme.colors.backgroundCard,
                }}
              >
                <Text style={{
                  color: active ? theme.colors.text : theme.colors.text,
                  fontWeight: 'bold',
                }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => {
            setValue('busca', '');
            setValue('status', 'todos');
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
          <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>
            Limpar filtros
          </Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={dates}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: date }) => (
          <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
            
         
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 10,
              color: theme.colors.text 
            }}>
              {formatarData(date)}
            </Text>

         
            {grouped[date].map(item => (
              <HistoricoCard key={item.id} item={item} />
            ))}
          </View>
        )}
      />
    </View>
  );
}