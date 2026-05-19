import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";

import { Form } from "../../../components/Form/Form";
import { InputField } from "../../../components/Form/InputField";
import { SubmitButton } from "../../../components/Form/SubmitButton";
import { useMensagem } from "../../../hooks/Outros/useMensagem";
import { useResponsavel } from "../../../hooks/Responsavel/useResponsavel";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { RootStackParamList } from "../../../navigation/types";
import { TypeMessage } from "@/mobile/types/Outros/messageType";

export function ResponsavelForm() {
  const route = useRoute<RouteProp<RootStackParamList, "ResponsavelForm">>();
  const { mode } = route.params || { mode: "create" };
  const { usuario } = useAuth();
  const showMessage = useMensagem();
  const { adicionarResponsavel, carregando } = useResponsavel();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!nome || !email) {
      showMessage("Preencha todos os campos.", TypeMessage.error);
      return;
    }

    if (!usuario?.dispositivos?.[0]?.id) {
      showMessage("Nenhum dispositivo associado.", TypeMessage.error);
      return;
    }

    try {
      await adicionarResponsavel(usuario.dispositivos[0].id, email);
      showMessage("Responsável adicionado com sucesso.", TypeMessage.success);
    } catch (error) {
      showMessage("Erro ao adicionar responsável.", TypeMessage.error);
    }
  };

  if (mode === "view") {
    return (
      <View style={{ flex: 1 }}>
        <Form title="Detalhes do Responsável">
          <View />
        </Form>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Form title="Adicionar Responsável">
        <InputField
          label="Nome do Responsável"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: João Silva"
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: joao@email.com"
          keyboardType="email-address"
        />

        <SubmitButton
          label="Adicionar Responsável"
          onPress={handleSubmit}
          loading={carregando}
        />
      </Form>
    </ScrollView>
  );
}