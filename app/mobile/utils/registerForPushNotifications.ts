import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7A",
    });
  }

  // Verifica se o app já tem permissão
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Se não tiver permissão, solicita ao usuário
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Se o usuário não concedeu permissão, retorna null
  if (finalStatus !== "granted") {
    console.log("Falha ao obter permissão para push notification!");
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
      
    if (!projectId) {
      console.error(
        "[registerForPushNotifications] projectId não encontrado na configuração do app.",
      );
      return null;
    }

    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    token = expoPushToken.data;
    console.log("Token de push notification obtido:", token);
  } catch (error) {
    console.error("Erro ao obter token de push notification:", error);
  }

  return token;
}
