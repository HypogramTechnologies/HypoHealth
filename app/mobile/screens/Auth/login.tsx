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
import { getApiBaseUrl } from "../../utils/getApiBaseUrl";
// Importe o AsyncStorage se você realmente precisar salvar o token diretamente nesta tela.
// Porém, o ideal é que isso aconteça dentro da função login() do seu useAuth.
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const showMessage  = useMensagem();
  const { theme } = useTheme();
  const [secure, setSecure] = useState(true);
  const { control, errors, handleSubmit } = useLoginScreen();

  async function handleLogin(data: any) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
        throw new Error(result.erro || "Erro ao realizar login");
      }

      // 1. Salvar token (Se não estiver sendo feito dentro de login(result))
      // await AsyncStorage.setItem('token', result.token);

      // 2. Envia os dados para o contexto global
      login(result);

      // 3. Verificando os dispositivos (como solicitado no seu snippet)

      showMessage("Login realizado com sucesso", "success");

      // 4. Redirecionar para o dashboard
      // IMPORTANTE: Se o seu App.tsx ou Routes.tsx já renderiza o Dashboard 
      // automaticamente quando existe um usuário logado, essa linha não é necessária.
      navigation.navigate("Dashboard" as never);

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
            label="E-mail"
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