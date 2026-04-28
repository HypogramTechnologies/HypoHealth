import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import { Controller } from "react-hook-form";
import { InputField } from "../../../components/Form/InputField";
import { Button } from "../../../components/Form/Button";
import { Form } from "../../../components/Form/Form";
// import { InputCombo } from "../../../components/Form/InputCombo";
import { useMedicamentoForm } from "../../../hooks/Medicamento/useMedicamentoForm";
import { MedicamentoFormData } from "../../../schemas/medicamento.schema";
import { useMensagem } from "../../../hooks/Outros/useMensagem";
import { TypeMessage } from "@/mobile/types/Outros/messageType";
import {navigateWithDelay} from "../../../utils/navigateWithDelay";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { MedicamentoDTO } from "@/mobile/types/Cadastros/medicamento";

type MedicamentoFormProps = NativeStackScreenProps<RootStackParamList, "MedicamentoForm">;

export function MedicamentoForm({ route, navigation }: MedicamentoFormProps) {
  const { mode, medicamentoId } = route.params;

  const {
    control,
    errors,
    screen,
    handleSubmit,
    saveAll,
    // optionsCompartimentos,
    // loadingCompartimentos,
  } = useMedicamentoForm(mode, medicamentoId, navigation);


  const showMessage = useMensagem();

  const onSubmit = async (data: MedicamentoFormData) => {
  try {

    const medicamentoDTO: MedicamentoDTO = {
      medicamentoNome: data.medicamentoNome,
      medicamentoDosagem: data.medicamentoDosagem,
      medicamentoDescricao: data.medicamentoDescricao ? data.medicamentoDescricao : "",
    };

    await saveAll(medicamentoDTO);

    showMessage(
      `Medicamento ${mode === "create" ? "cadastrado" : "atualizado"} com sucesso.`,
      TypeMessage.success
    );

    await navigateWithDelay(() => navigation.goBack());

  } catch (error: any) {
    showMessage(getErrorMessage(error), TypeMessage.error);
  }
};

  
  return (
    <Form>
      <Controller
        control={control}
        name="medicamentoNome"
        render={({ field }) => (
          <InputField
            label="Nome do medicamento *"
            value={field.value}
            onChangeText={field.onChange}
            editable={!screen.readOnly}
            error={errors.medicamentoNome?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="medicamentoDescricao"
        render={({ field }) => (
          <InputField
            label="Descrição *"
            value={field.value}
            onChangeText={field.onChange}
            editable={!screen.readOnly}
            error={errors.medicamentoDescricao?.message}
          />
        )}
      />

      {/* <Controller
        control={control}
        name="cursoId"
        render={({ field }) => (
          <InputCombo
            label="Curso *"
            value={field.value}
            options={optionsCompartimentos}
            loading={loadingCompartimentos}
            onChange={field.onChange}
            disabled={screen.readOnly}
            error={errors.cursoId?.message}
          />
        )}
      /> */}

      <Controller
        control={control}
        name="medicamentoDosagem"
        render={({ field }) => (
          <InputField
            label="Dosagem *"
            value={field.value}
            // onChangeText={(text) => field.onChange(formatar.email(text))}
            onChangeText={field.onChange}
            keyboardType="numeric"
            error={errors.medicamentoDosagem?.message}
          />
        )}
      />

      {!screen.isView && (
        <Button
          label={mode === "create" ? "Salvar" : "Atualizar"}
          onPress={handleSubmit(onSubmit)}
          disabled={screen.loading}
          marginTop={20}
        />
      )}
    </Form>
  );
}
