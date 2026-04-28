import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "./mobile/contexts/Theme/themeContext";
import { AuthProvider } from "./mobile/contexts/Auth/authContext";
import { Routes } from "./mobile/routes";
import { MensagemProvider } from "./mobile/contexts/Mensagem/mensagemContext";

function RootLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View
        style={{
          height: insets.top,
          backgroundColor: theme.colors.destaque,
        }}
      >
        <StatusBar
          style={theme.mode === "dark" ? "dark" : "light"}
          translucent
        />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Routes />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MensagemProvider>
          <PaperProvider>
            <RootLayout />
          </PaperProvider>
        </MensagemProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
