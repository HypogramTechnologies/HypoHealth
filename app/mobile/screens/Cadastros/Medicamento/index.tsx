import React, {
  useState,
  useCallback,
} from 'react';

import {
  View,
} from 'react-native';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { Carteira } from '../../../components/Form/Carteira';

import { CarteiraItem } from '../../../components/Form/CarteiraItem';

import { CarteiraHeader } from '../../../components/Form/CarteiraHeader';

import { FilterSheet } from '../../../components/Filtro/FilterSheet';

import { FakeBottomSheet } from '../../../components/Form/FakeButtonSheet';

import { EmptyCarteira } from '../../../components/Feedback/EmptyCarteira';

import { ConfirmDialog } from '../../../components/Feedback/ConfirmDialog';

import { useCarteira } from '../../../hooks/Medicamento/useMedicamento';

import { useFilterSheet } from '../../../hooks/Filter/useFilterSheet';

import { useGenericFilter } from '../../../hooks/Filter/useGenericFilter';

import { useMensagem } from '../../../hooks/Outros/useMensagem';

import {
  MedicamentoDetalhado,
  MedicamentoFiltro,
} from '../../../types/Cadastros/medicamento';

import { RootStackParamList } from '../../../navigation/types';

import { TypeMessage } from '@/mobile/types/Outros/messageType';

import { FiltroMedicamento } from './filtro';

function description(
  item: MedicamentoDetalhado,
): string {
  return item.descricao || '';
}

export function Medicamento() {
  type MedicamentoNavigationProp =
    NativeStackNavigationProp<
      RootStackParamList,
      'Medicamento'
    >;

  const navigation =
    useNavigation<MedicamentoNavigationProp>();

  const showMessage =
    useMensagem();

  const {
    visible,
    abrir,
    fechar,
  } = useFilterSheet();

  const [
    confirmVisible,
    setConfirmVisible,
  ] = useState(false);

  const [
    selectedId,
    setSelectedId,
  ] = useState<string | null>(
    null,
  );

  const {
    filters,
    setFilters,
    clearFilters,
  } =
    useGenericFilter<MedicamentoFiltro>();

  const {
    dados,
    buscarCarteira,
    deleteMedicamento,
  } = useCarteira();

  const [busca, setBusca] =
    useState('');

  const handleConfirmDelete =
    async () => {
      if (!selectedId) {
        return;
      }

      try {
        await deleteMedicamento(
          selectedId,
        );

        showMessage(
          'Medicamento excluído com sucesso.',
          TypeMessage.success,
        );
      } catch {
        showMessage(
          'Erro ao excluir o medicamento.',
          TypeMessage.error,
        );
      } finally {
        setConfirmVisible(false);

        setSelectedId(null);
      }
    };

  useFocusEffect(
    useCallback(() => {
      buscarCarteira({
        ...filters,
        medicamentoNome: busca,
      });
    }, [
      buscarCarteira,
      filters,
      busca,
    ]),
  );

  return (
    <View style={{ flex: 1 }}>
      <Carteira title="Medicamento">
        <CarteiraHeader
          placeholder="Buscar medicamento..."
          searchValue={busca}
          onSearchChange={setBusca}
          onFilterPress={abrir}
          onAddPress={() =>
            navigation.navigate(
              'MedicamentoForm',
              {
                mode: 'create',
              },
            )
          }
        />

        {dados.length === 0 ? (
          <EmptyCarteira />
        ) : (
          dados.map(item => (
            <CarteiraItem
              key={item.id}
              icon="pill"
              title={item.nome}
              description={description(
                item,
              )}
              badge={item.dosagem}
              onPress={() =>
                navigation.navigate(
                  'MedicamentoForm',
                  {
                    medicamentoId:
                      item.id,

                    mode: 'edit',
                  },
                )
              }
              onPressDelete={() => {
                setSelectedId(
                  item.id ?? null,
                );

                setConfirmVisible(
                  true,
                );
              }}
            />
          ))
        )}
      </Carteira>

      <ConfirmDialog
        visible={confirmVisible}
        title="Excluir medicamento"
        description="Deseja excluir este medicamento? Essa ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        danger
        onCancel={() => {
          setConfirmVisible(false);

          setSelectedId(null);
        }}
        onConfirm={
          handleConfirmDelete
        }
      />

      <FakeBottomSheet
        visible={visible}
        onClose={fechar}
      >
        <FilterSheet
          filters={
            FiltroMedicamento
          }
          filtroAtual={filters}
          onApply={data => {
            setFilters(data);

            buscarCarteira({
              ...data,
              medicamentoNome:
                busca,
            });

            fechar();
          }}
          onClear={() => {
            clearFilters();

            buscarCarteira({
              medicamentoNome:
                busca,
            });

            fechar();
          }}
        />
      </FakeBottomSheet>
    </View>
  );
}