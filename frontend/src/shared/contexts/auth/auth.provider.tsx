import React, { useMemo, useState } from "react";
import { localStorageKeys } from "../../utils/storage.utils";
import { AuthContext } from "./auth.context";
import type { User } from "./auth.types";

export const AUTH_CHANGE_EVENT = "auth:change";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(localStorageKeys.authUser);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (data: { email: string; name?: string }) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name || data.email.split("@")[0],
      email: data.email,
    };
    localStorage.setItem(localStorageKeys.authUser, JSON.stringify(newUser));
    setUser(newUser);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const logout = () => {
    localStorage.removeItem(localStorageKeys.authUser);
    setUser(null);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
