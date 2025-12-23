// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  signin: (user: string, callback: () => void) => void;
  signout: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const signin = (newUser: string, callback: () => void) => {
    setUser(newUser);
    callback();
  };

  const signout = (callback: () => void) => {
    setUser(null);
    callback();
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}