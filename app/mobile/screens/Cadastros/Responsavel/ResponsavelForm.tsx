import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Controller } from "react-hook-form";

import { Form } from "../../../components/Form/Form";
import { InputField } from "../../../components/Form/InputField";
import { ActionButton } from "@/mobile/components/MedicamentoForm/ActionButton";
import { RootStackParamList } from "../../../navigation/types";
import { useMensagem } from "../../../hooks/Outros/useMensagem";
import { useResponsavel } from "../../../hooks/Responsavel/useResponsavel";
import { TypeMessage } from "@/mobile/types/Outros/messageType";
import { Responsavel as ResponsavelType } from "@/mobile/types/Cadastros/responsavel";

// Definindo explicitamente o que a rota pode receber localmente para evitar erros de tipagem
type ResponsavelFormRouteProp = RouteProp<RootStackParamList, "ResponsavelForm"> & {
  params: {
    mode?: "create" | "view" | "edit";
    responsavelId?: string;
    responsavel?: ResponsavelType; // Adicionado de forma estendida aqui
  };
};

export function ResponsavelForm() {
  const navigation = useNavigation();
  const route = useRoute<ResponsavelFormRouteProp>();
  const showMessage = useMensagem();

  const { mode = "create", responsavel } = route.params || {};

  const {
    control,
    errors,
    secure,
    setSecure,
    secureConfirm,
    setSecureConfirm,
    submit,
  } = useResponsavel({
    mode,
    responsavel,
  });

  async function handleForm() {
    try {
      const success = await submit();

      if (success) {
        showMessage(
          mode === "create"
            ? "Responsável criado com sucesso!"
            : "Responsável atualizado com sucesso!",
          TypeMessage.success
        );

        navigation.goBack();
      }
    } catch (error: any) {
      showMessage(
        error.message || "Erro ao salvar responsável",
        TypeMessage.error
      );
    }
  }

  return (
    <Form>
      <Controller
        control={control}
        name="nome"
        render={({ field }) => (
          <InputField
            label="Nome"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.nome?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <InputField
            label="E-mail"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="senha"
        render={({ field }) => (
          <InputField
            label="Senha"
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry={secure}
            rightIcon={secure ? "eye-off" : "eye"}
            onRightIconPress={() => setSecure(!secure)}
            error={errors.senha?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmarSenha"
        render={({ field }) => (
          <InputField
            label="Confirmar senha"
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry={secureConfirm}
            rightIcon={secureConfirm ? "eye-off" : "eye"}
            onRightIconPress={() => setSecureConfirm(!secureConfirm)}
            error={errors.confirmarSenha?.message}
          />
        )}
      />

      <ActionButton
        title={mode === "create" ? "Salvar" : "Atualizar"}
        icon="save-outline"
        onPress={handleForm}
      />
    </Form>
  );
}