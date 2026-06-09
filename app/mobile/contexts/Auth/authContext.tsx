import { Usuario } from "../../types/Auth/usuario";
import { createContext, useState, ReactNode } from "react";
import { setAuthorizationToken } from "../../services/api";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotifications";
import { UsuarioService } from "../../services/usuarioService";

export type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;

  login: (data: { usuario: Usuario; token: string }) => Promise<void>;

  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [token, setToken] = useState<string | null>(null);

  async function login(data: { usuario: Usuario; token: string }) {
    setUsuario(data.usuario);
    setToken(data.token);
    setAuthorizationToken(data.token);

    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await UsuarioService.salvarPushToken(data.usuario.id, pushToken);
      }
    } catch (error) {
      console.error(
        "[AuthContext] Erro ao processar o push token após login:",
        error,
      );
    }
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    setAuthorizationToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
