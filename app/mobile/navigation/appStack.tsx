import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTheme } from "../../mobile/contexts/Theme/themeContext";
import { RootStackParamList } from "./types";

import { Home } from "../screens/Home";
import { BottomTabs } from "./bottomTabs";
import { Perfil } from "../screens/Perfil";
import { Medicamento } from "../screens/Cadastros/Medicamento";
import { MedicamentoForm } from "../screens/Cadastros/Medicamento/MedicamentoForm";
import { Historico } from "../screens/Cadastros/Historico";
import { Alerta } from "../screens/Cadastros/Alerta";
import { ResponsavelForm } from "../screens/Cadastros/Responsavel/ResponsavelForm";
import { Responsavel } from "../screens/Cadastros/Responsavel";
import {AbastecimentoForm} from "../screens/Cadastros/Abastecimento/AbastecimentoForm"

// import { Agendamento } from "../screens/Cadastros/Agendamento";
// import { AgendamentoForm } from "../screens/Cadastros/Agendamento/AgendamentoForm";
// import { Responsavel } from "../screens/Cadastros/Responsavel";
// import { ResponsavelForm } from "../screens/Cadastros/Responsavel/ResponsavelForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStack() {
  const { theme } = useTheme();

  const headerOptions = {
    headerStyle: { backgroundColor: theme.colors.surface },
    headerShadowVisible: false,
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontWeight: "bold" as const },
  };

  return (
    <Stack.Navigator>


      <Stack.Screen
        name="Tabs"
        component={BottomTabs}
        options={{
          headerShown: false,

        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Historico"
        component={Historico}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Alerta"
        component={Alerta}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Medicamento"
        component={Medicamento}
        options={{ title: "Medicamentos", ...headerOptions }}
      />
      <Stack.Screen
        name="MedicamentoForm"
        component={MedicamentoForm}
        options={{ title: "Medicamento", ...headerOptions }}
      />

      {/* <Stack.Screen
        name="Agendamento"
        component={Agendamento}
        options={{ title: 'Agendamentos', ...headerOptions }}
      /> 
      <Stack.Screen
        name="AgendamentoForm"
        component={AgendamentoForm}
        options={{ title: 'Agendamentos', ...headerOptions }}
      /> */}

      <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={{ title: 'Meu Perfil', ...headerOptions }}
      />

      <Stack.Screen
        name="Responsavel"
        component={Responsavel}
        options={{ title: "Responsáveis", ...headerOptions }}
      />
      <Stack.Screen
        name="ResponsavelForm"
        component={ResponsavelForm}
        options={{ title: "Responsável", ...headerOptions }}
      />
       <Stack.Screen
        name="AbastecimentoForm"
        component={AbastecimentoForm}
        options={{ title: "Abastecimento", ...headerOptions }}
      />
    </Stack.Navigator>
  );
}
