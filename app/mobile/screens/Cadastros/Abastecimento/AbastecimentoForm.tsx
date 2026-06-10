import React from "react";

import { Text } from "react-native";

import { Controller } from "react-hook-form";

import { Form } from "../../../components/Form/Form";

import { NumberSelector } from "../../../components/MedicamentoForm/NumberSelector";

import { Button } from "../../../components/Form/Button";
import { useNavigation } from "@react-navigation/native";

import { useMensagem } from "../../../hooks/Outros/useMensagem";

import { TypeMessage } from "../../../types/Outros/messageType";

import { useAbastecimentoForm } from "../../../hooks/Abastecimento/useAbastecimentoForm";

import { useTheme } from "../../../contexts/Theme/themeContext";

export function AbastecimentoForm() {
  const { theme } = useTheme();
  const showMessage = useMensagem();
  const navigation = useNavigation();
  const [aguardandoConclusao, setAguardandoConclusao] = React.useState(false);
  const { control, handleSubmit, errors, compartimentosDisponiveis, save } =
    useAbastecimentoForm();

  async function handleSave(data: any) {
    try {
      setAguardandoConclusao(true);
      const result = await save(data);

      setAguardandoConclusao(false);
      showMessage(
        result.message,
        result.success ? TypeMessage.success : TypeMessage.error,
      );
    } catch (error: any) {
      setAguardandoConclusao(false);
      showMessage(
        error?.message || "Erro ao abrir compartimento",
        TypeMessage.error,
      );
    }
  }

  return (
    <Form>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 16,
          color: theme.colors.text,
        }}
      >
        Selecione o compartimento
      </Text>

      <Controller
        control={control}
        name="compartimento"
        render={({ field }) => (
          <NumberSelector
            values={compartimentosDisponiveis.map((item) => item.posicao)}
            title={compartimentosDisponiveis.map((item) =>
              String(item.posicao),
            )}
            description={compartimentosDisponiveis.map(
              (item) => item.dia_semana,
            )}
            selected={field.value ? [field.value] : []}
            onChange={(value) => field.onChange(Number(value))}
          />
        )}
      />

      {errors.compartimento && (
        <Text
          style={{
            color: "red",
            marginTop: 8,
          }}
        >
          {errors.compartimento.message}
        </Text>
      )}

      <Button
        label={aguardandoConclusao ? "Aguardando conclusão..." : "Abrir"}
        icon="cube-outline"
        disabled={aguardandoConclusao}
        onPress={handleSubmit(handleSave)}
      />
    </Form>
  );
}
