import { View, Text, TouchableOpacity } from "react-native";

import { useState } from "react";

import { Controller } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/Auth/useAuth";

import { useMensagem } from "../../hooks/Outros/useMensagem";

import { useTheme } from "@/mobile/contexts/Theme/themeContext";

import { Form } from "../../components/Form/Form";

import { InputField } from "../../components/Form/InputField";

import { ActionButton } from "../../components/MedicamentoForm/ActionButton";

import { useCadastroScreen } from "../../hooks/Auth/useCadastroScreen";
import { Row } from "@/mobile/components/Form/Row";

export default function CadastroScreen() {
  const { login } = useAuth();

  const showMessage = useMensagem();

  const { theme } = useTheme();

  const navigation = useNavigation();

  const [secure, setSecure] = useState(true);

  const [secureConfirm, setSecureConfirm] = useState(true);

  const {
    control,

    errors,

    handleSubmit,

    etapa,

    setEtapa,

    validarDispositivo,

    cadastrar,

    dispositivo,

    loading,
  } = useCadastroScreen();

  return (
    <Form loading={loading}>
      <TouchableOpacity
        onPress={() => {
          if (etapa === 1) {
            navigation.goBack();
            return;
          }

          setEtapa(1);
        }}
        style={{
          width: 44,

          height: 44,

          borderRadius: 999,

          backgroundColor: theme.colors.background,

          alignItems: "center",

          justifyContent: "center",

          marginBottom: 10,
        }}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={22}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: theme.colors.textSecondary,

          fontSize: 15,
        }}
      >
        Passo {etapa} de 2
      </Text>

      <Text
        style={{
          fontSize: 34,

          fontWeight: "700",

          color: theme.colors.text,

          marginBottom: 20,
        }}
      >
        {etapa === 1 ? "Dispositivo" : "Criar Conta"}
      </Text>

      <View
        style={{
          flexDirection: "row",

          gap: 10,

          marginBottom: 30,
        }}
      >
        <View
          style={{
            flex: 1,

            height: 6,

            borderRadius: 999,

            backgroundColor:
              etapa >= 1 ? theme.colors.primary : theme.colors.border,
          }}
        />

        <View
          style={{
            flex: 1,

            height: 6,

            borderRadius: 999,

            backgroundColor:
              etapa >= 2 ? theme.colors.primary : theme.colors.border,
          }}
        />
      </View>

      {etapa === 1 && (
        <>
          <View
            style={{
              backgroundColor: theme.colors.primary,

              borderRadius: 28,

              padding: 24,

              marginBottom: 25,
            }}
          >
            <Text
              style={{
                color: "#fff",

                fontWeight: "700",

                marginBottom: 10,
              }}
            >
              SEJA BEM-VINDO(A) AO HYPOHEALTH!
            </Text>

            <Text
              style={{
                color: "#fff",

                fontSize: 28,

                lineHeight: 36,

                fontWeight: "700",
              }}
            >
              Para começar precisamos de algumas informações sobre o dispositivo
            </Text>
          </View>

          <Controller
            control={control}
            name="numeroSerie"
            render={({ field }) => (
              <InputField
                label="Número de série"
                placeholder="Ex: 02D3G2D6EF2A"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.numeroSerie?.message}
              />
            )}
          />

          <View
            style={{
              
              borderWidth: 1,

              borderColor: theme.colors.destaque_amarelo,

              borderRadius: 18,

              padding: 16,

              marginBottom: 20,
            }}
          >
            <Row>
              <MaterialCommunityIcons
                name="alert"
                size={20}
                color={theme.colors.destaque_amarelo}
                style={{ marginRight: 6}}
              />
            <Text
              style={{
                color: theme.colors.text,
              }}
            >
              
              Verifique abaixo do dispositivo o número de série.
            </Text>
            </Row>
          </View>

          <Controller
            control={control}
            name="nomeDispositivo"
            render={({ field }) => (
              <InputField
                label="Nome do dispositivo"
                placeholder="Ex: Caixinha da Vovó"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.nomeDispositivo?.message}
              />
            )}
          />

          <ActionButton
            title="Continuar"
            icon="arrow-forward"
            onPress={validarDispositivo}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Login" as never)}
            style={{
              marginTop: 25,

              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.textSecondary,

                textDecorationLine: "underline",

                fontWeight: "600",
              }}
            >
              Cancelar e voltar ao login
            </Text>
          </TouchableOpacity>
        </>
      )}

      {etapa === 2 && (
        <>
          <View
            style={{
              backgroundColor: theme.colors.background,

              borderWidth: 1,

              borderColor: theme.colors.primary,

              borderRadius: 20,

              padding: 18,

              flexDirection: "row",

              alignItems: "center",

              gap: 14,

              marginBottom: 25,
            }}
          >
            <View
              style={{
                width: 42,

                height: 42,

                borderRadius: 999,

                backgroundColor: theme.colors.primary,

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="devices"
                size={22}
                color={theme.colors.text}
              />
            </View>

            <View>
              <Text
                style={{
                  fontWeight: "700",

                  color: theme.colors.text,
                }}
              >
                {dispositivo?.nome}
              </Text>

              <Text
                style={{
                  color: theme.colors.text,
                }}
              >
                {dispositivo?.mac_address}
              </Text>
            </View>
          </View>

          <Controller
            control={control}
            name="nome"
            render={({ field }) => (
              <InputField
                label="Nome completo"
                placeholder="Seu nome"
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
                placeholder="seu@email.com"
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
                placeholder="Crie uma senha"
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
                placeholder="Repita a senha"
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
            title="Criar conta"
            icon="person-add-outline"
            onPress={handleSubmit(cadastrar)}
          />
        </>
      )}
    </Form>
  );
}
