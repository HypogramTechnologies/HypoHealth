import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Carteira } from "../../../components/Form/Carteira";
import { CarteiraItem } from "../../../components/Form/CarteiraItem";
import { CarteiraHeader } from "../../../components/Form/CarteiraHeader";
import { EmptyCarteira } from "../../../components/Feedback/EmptyCarteira";
import { ConfirmDialog } from "../../../components/Feedback/ConfirmDialog";
import { useMensagem } from "../../../hooks/Outros/useMensagem";
import { useResponsavel } from "../../../hooks/Responsavel/useResponsavel";
import { RootStackParamList } from "../../../navigation/types";
import { TypeMessage } from "@/mobile/types/Outros/messageType";

export function Responsavel() {
  type ResponsavelNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Responsavel"
  >;

  const navigation = useNavigation<ResponsavelNavigationProp>();
  const showMessage = useMensagem();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { responsaveis, buscarResponsaveis, removerResponsavel } = useResponsavel();

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await removerResponsavel(selectedId);
      showMessage(
        "Responsável removido com sucesso.",
        TypeMessage.success
      );
    } catch {
      showMessage("Erro ao remover responsável.", TypeMessage.error);
    } finally {
      setConfirmVisible(false);
      setSelectedId(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarResponsaveis();
    }, [buscarResponsaveis])
  );

  return (
    <View style={{ flex: 1 }}>
      <Carteira title="Responsáveis">
        <CarteiraHeader
          placeholder="Buscar responsável..."
          onAddPress={() =>
            navigation.navigate("ResponsavelForm", {
              mode: "create",
            })
          }
        />

        {responsaveis.length === 0 ? (
          <EmptyCarteira />
        ) : (
          responsaveis.map((item) => (
            <CarteiraItem
              key={item.id}
              icon="user"
              title={item.usuario?.nome || "Sem Nome"} // Proteção com Optional Chaining
              description={item.usuario?.email || "Sem Email"} // Proteção com Optional Chaining
              onPress={() =>
                navigation.navigate("ResponsavelForm", {
                  responsavelId: item.id,
                  mode: "view",
                })
              }
              onPressDelete={() => {
                setSelectedId(item.id);
                setConfirmVisible(true);
              }}
            />
          ))
        )}
      </Carteira>

      <ConfirmDialog
        visible={confirmVisible}
        title="Remover responsável"
        description="Deseja remover este responsável? Essa ação não poderá ser desfeita."
        confirmText="Remover"
        cancelText="Cancelar"
        danger
        onCancel={() => {
          setConfirmVisible(false);
          setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}