import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/Auth/useAuth";
import { InputField } from "../../components/Form/InputField";
import { Button } from "../../components/Form/Button";
import { Controller } from "react-hook-form";
import { useLoginScreen } from "../../hooks/Auth/useLoginScreen";
import { Form } from "../../components/Form/Form";
import { useTheme } from "@/mobile/contexts/Theme/themeContext";
import { useMensagem } from "../../hooks/Outros/useMensagem";
import { useState } from "react";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const showMessage  = useMensagem();
  const { theme } = useTheme();
  const [secure, setSecure] = useState(true);
  const { control, errors, handleSubmit } = useLoginScreen();

  async function handleLogin(data: any) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: data.usuarioLogin,
          senha: data.usuarioSenha,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.erro);
      }

      login(result);

      showMessage("Login realizado com sucesso", "success");
    } catch (error: any) {
      showMessage(error.message || "Erro ao realizar login", "error");
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
            width: 150,
            height: 150,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: theme.colors.text,
          }}
        >
          HypoHealth
        </Text>

        <Text
          style={{
            color: theme.colors.destaque,
            textAlign: "center",
            marginTop: 5,
          }}
        >
          Gerenciamento de medicamentos
        </Text>
      </View>

      <Controller
        control={control}
        name="usuarioLogin"
        render={({ field }) => (
          <InputField
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.usuarioLogin?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="usuarioSenha"
        render={({ field }) => (
          <InputField
            label="Senha"
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry={secure}
            icon="lock"
            iconPosition="inside"
            rightIcon={secure ? "eye-off" : "eye"}
            onRightIconPress={() => setSecure(!secure)}
            error={errors.usuarioSenha?.message}
          />
        )}
      />

      <Button label="Entrar" onPress={handleSubmit(handleLogin)} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Cadastro" as never)}
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
          Não possui conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </Form>
  );
}
