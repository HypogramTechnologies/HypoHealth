import {Usuario} from '../../types/Auth/usuario';
import { createContext, useState, ReactNode } from 'react';

export type AuthContextType = {
  user: Usuario | null;
  token: string | null;
  login: (data: { user: Usuario; token: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  

  function login(data: { user: Usuario; token: string }) {
    setUser(data.user);
    setToken(data.token);
    
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}