import { Usuario } from "../../types/Auth/usuario";
import { createContext, useState, ReactNode } from "react";
import { setAuthorizationToken } from '../../services/api';

export type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;

  login: (data: { usuario: Usuario; token: string }) => void;

  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [token, setToken] = useState<string | null>(null);

  function login(data: { usuario: Usuario; token: string }) {
    console.log("DADOS DE LOGIN:", data);
    setUsuario(data.usuario);
    setToken(data.token);
    setAuthorizationToken(data.token);
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
