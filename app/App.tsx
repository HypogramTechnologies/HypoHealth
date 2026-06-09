import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context"; // 👈 IMPORTADO AQUI
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { ThemeProvider, useTheme } from "./mobile/contexts/Theme/themeContext";
import { AuthProvider } from "./mobile/contexts/Auth/authContext";
import { Routes } from "./mobile/routes";
import { MensagemProvider } from "./mobile/contexts/Mensagem/mensagemContext";

function RootLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // 👈 Agora o hook vai funcionar perfeitamente!

  const paperTheme = theme.mode === "dark" 
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...theme.colors } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...theme.colors } };

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        <View
          style={{
            height: insets.top,
            backgroundColor: theme.colors.destaque,
          }}
        >
          <StatusBar
            style={theme.mode === "dark" ? "light" : "dark"}
            translucent
          />
        </View>

        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Routes />
        </View>
      </View>
    </PaperProvider>
  );
}

export default function App() {
  return (
    // 👈 O SafeAreaProvider DEVE ser o componente mais externo de todos
    <SafeAreaProvider> 
      <AuthProvider>
        <ThemeProvider>
          <MensagemProvider>
            <RootLayout />
          </MensagemProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}