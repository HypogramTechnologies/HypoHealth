import { View, Text, TouchableOpacity, Image } from "react-native"; 
import { useAuth } from "../../hooks/Auth/useAuth";
import { InputField } from "../../components/Form/InputField";
import { Button } from "../../components/Form/Button";
import { Controller } from "react-hook-form";
import { useLoginScreen } from "../../hooks/Auth/useLoginScreen";
import { Form } from "../../components/Form/Form";
import { useTheme } from "@/mobile/contexts/Theme/themeContext";
import { useState } from "react";

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [secure, setSecure] = useState(true);
  const { control, errors, handleSubmit } = useLoginScreen();

  const [role, setRole] = useState<"aluno" | "professor" | "admin">("aluno");

  function handleLogin() {
    login({
      user: {
        usuarioId: "1",
        usuarioNome: "Andressa",
        usuarioLogin: "andressa",
        usuarioSenha: "123",
        usuarioRole: role,
      },
      token: "123",
    });
  }

  return (
    <Form>
     
      <View style={{ alignItems: "center", marginBottom: 30 }}>
       
        <Image 
          source={require("../../../assets/logo.png")} 
          style={{ 
            width: 80,  
            height: 80, 
            marginBottom: 15 
          }} 
          resizeMode="contain"
        />

        <Text
          style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.text }}
        >
          App Scholar
        </Text>
        <Text style={{ color: theme.colors.destaque, textAlign: 'center' }}>
          Gerenciamento de medicamentos 
        </Text>
      </View>

    

      {/* Inputs de Login */}
      <Controller
        control={control}
        name="usuarioLogin"
        render={({ field }) => (
          <InputField
            label="E-mail institucional ou login"
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
    </Form>
  );
}