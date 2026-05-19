import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useAuth } from "../../hooks/Auth/useAuth";
import { useMensagem } from "../../hooks/Outros/useMensagem";
import { useTheme } from "@/mobile/contexts/Theme/themeContext";
import { Form } from "../../components/Form/Form";
import { InputField } from "../../components/Form/InputField";
import { Button } from "../../components/Form/Button";
import { useCadastroScreen } from "../../hooks/Auth/useCadastroScreen";
import { useNavigation } from "@react-navigation/native";

export default function CadastroScreen() {
  const { login } = useAuth();
  const showMessage = useMensagem();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const { control, errors, handleSubmit, dispositivoId } = useCadastroScreen();

  async function handleCadastro(data: any) {
    try {
      if (data.confirmarSenha !== data.senha) {
        showMessage("As senhas não coincidem", "error");
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_URL}:${process.env.EXPO_PUBLIC_PORT}/api/auth/cadastro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            senha: data.senha,
            dispositivo_id: dispositivoId,
          }),
        },
      );

      const result = await response.json();
      console.log("Resposta do cadastro:", result);
      if (!response.ok) {
        throw new Error(result.erro);
      }

      login(result);

      showMessage("Cadastro realizado com sucesso", "success");
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);
      showMessage(error.message || "Erro ao realizar cadastro", "error");
    }
  }

  return (
    <Form>
      <View
        style={{
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Image
          source={require("../../../assets/logo.png")}
          style={{
            width: 140,
            height: 140,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 30,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          Criar Conta
        </Text>

        <Text
          style={{
            color: theme.colors.destaque,
            textAlign: "center",
            marginTop: 5,
          }}
        >
          Cadastre-se no HypoHealth
        </Text>
      </View>

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
            label="Email"
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

      <Button label="Cadastrar" onPress={handleSubmit(handleCadastro)} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login" as never)}
        style={{
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: theme.colors.destaque,
            fontWeight: "600",
          }}
        >
          Já possui conta? Entrar
        </Text>
      </TouchableOpacity>
    </Form>
  );
}
