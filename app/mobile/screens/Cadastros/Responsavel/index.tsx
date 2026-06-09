import React, {
  useState,
  useCallback,
} from "react";

import { View } from "react-native";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { Carteira } from "../../../components/Form/Carteira";

import { CarteiraItem } from "../../../components/Form/CarteiraItem";

import { CarteiraHeader } from "../../../components/Form/CarteiraHeader";

import { FilterSheet } from "../../../components/Filtro/FilterSheet";

import { FakeBottomSheet } from "../../../components/Form/FakeButtonSheet";

import { EmptyCarteira } from "../../../components/Feedback/EmptyCarteira";

import { ConfirmDialog } from "../../../components/Feedback/ConfirmDialog";

import { useFilterSheet } from "../../../hooks/Filter/useFilterSheet";

import { useGenericFilter } from "../../../hooks/Filter/useGenericFilter";

import { useMensagem } from "../../../hooks/Outros/useMensagem";

import { useResponsavel } from "../../../hooks/Responsavel/useResponsavel";

import {
  ResponsavelDetalhado,
  ResponsavelFiltro,
} from "../../../types/Cadastros/responsavel";

import { RootStackParamList } from "../../../navigation/types";

import { TypeMessage } from "@/mobile/types/Outros/messageType";

import { FiltroResponsavel } from "./filtro";

function description(
  item: ResponsavelDetalhado,
): string {
  return (
    item.usuario?.email || ""
  );
}

export function Responsavel() {
  type ResponsavelNavigationProp =
    NativeStackNavigationProp<
      RootStackParamList,
      "Responsavel"
    >;

  const navigation =
    useNavigation<ResponsavelNavigationProp>();

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
    useGenericFilter<ResponsavelFiltro>();

  const {
    responsaveis,
    buscarResponsaveis,
    removerResponsavel,
  } = useResponsavel();

  const [busca, setBusca] =
    useState("");

  const handleConfirmDelete =
    async () => {
      if (!selectedId) {
        return;
      }

      try {
        await removerResponsavel(
          selectedId,
        );

        showMessage(
          "Responsável removido com sucesso.",
          TypeMessage.success,
        );
      } catch {
        showMessage(
          "Erro ao remover responsável.",
          TypeMessage.error,
        );
      } finally {
        setConfirmVisible(
          false,
        );

        setSelectedId(null);
      }
    };

  useFocusEffect(
    useCallback(() => {
      buscarResponsaveis();
    }, [buscarResponsaveis]),
  );

  const responsaveisFiltrados =
  responsaveis.filter(item => {
    const nome =
      item.usuario?.nome?.toLowerCase() ||
      "";

    const email =
      item.usuario?.email?.toLowerCase() ||
      "";

    const termo =
      busca.toLowerCase();

    // Agora filtra apenas se o nome incluir o que foi digitado
    const matchBusca = nome.includes(termo);

    const matchNome =
      filters.nome
        ? nome.includes(
            filters.nome.toLowerCase(),
          )
        : true;

    const matchEmail =
      filters.email
        ? email.includes(
            filters.email.toLowerCase(),
          )
        : true;

    return (
      matchBusca &&
      matchNome &&
      matchEmail
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <Carteira title="Responsáveis">
        <CarteiraHeader
          placeholder="Buscar responsável..."
          searchValue={busca}
          onSearchChange={
            setBusca
          }
          onFilterPress={abrir}
          onAddPress={() =>
            navigation.navigate(
              "ResponsavelForm",
              {
                mode:
                  "create",
              },
            )
          }
        />

        {responsaveisFiltrados.length ===
        0 ? (
          <EmptyCarteira />
        ) : (
          responsaveisFiltrados.map(
            item => (
              <CarteiraItem
                key={item.id}
                icon="contacts"
                title={
                  item.usuario
                    ?.nome ||
                  "Sem Nome"
                }
                description={description(
                  item,
                )}
                
                onPress={() =>
                  navigation.navigate(
                    "ResponsavelForm",
                    {
                      responsavelId:
                        item.id,

                      mode:
                        "view",
                    },
                  )
                }
                onPressDelete={() => {
                  setSelectedId(
                    item.id,
                  );

                  setConfirmVisible(
                    true,
                  );
                }}
              />
            ),
          )
        )}
      </Carteira>

      <ConfirmDialog
        visible={
          confirmVisible
        }
        title="Remover responsável"
        description="Deseja remover este responsável? Essa ação não poderá ser desfeita."
        confirmText="Remover"
        cancelText="Cancelar"
        danger
        onCancel={() => {
          setConfirmVisible(
            false,
          );

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
            FiltroResponsavel
          }
          filtroAtual={filters}
          onApply={data => {
            setFilters(data);

            fechar();
          }}
          onClear={() => {
            clearFilters();

            fechar();
          }}
        />
      </FakeBottomSheet>
    </View>
  );
}