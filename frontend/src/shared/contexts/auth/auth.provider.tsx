import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../configs/supabase.configs";
import { formatAuthError } from "../../utils/auth-error.utils";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Usuário",
          email: session.user.email || "",
        };
        setUser(mappedUser);
        localStorage.setItem(
          localStorageKeys.authUser,
          JSON.stringify(mappedUser),
        );
      } else {
        setUser(null);
        localStorage.removeItem(localStorageKeys.authUser);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Usuário",
          email: session.user.email || "",
        };
        setUser(mappedUser);
        localStorage.setItem(
          localStorageKeys.authUser,
          JSON.stringify(mappedUser),
        );
      } else {
        setUser(null);
        localStorage.removeItem(localStorageKeys.authUser);
      }
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const { data: resData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    if (resData.user) {
      const mappedUser: User = {
        id: resData.user.id,
        name:
          resData.user.user_metadata?.name ||
          resData.user.email?.split("@")[0] ||
          "Usuário",
        email: resData.user.email || "",
      };

      setUser(mappedUser);

      localStorage.setItem(
        localStorageKeys.authUser,
        JSON.stringify(mappedUser),
      );
    }

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));

    return { success: true };
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    const { data: resData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    if (resData.user) {
      const mappedUser: User = {
        id: resData.user.id,
        name: data.name || resData.user.email?.split("@")[0] || "Usuário",
        email: resData.user.email || "",
      };
      setUser(mappedUser);
      localStorage.setItem(
        localStorageKeys.authUser,
        JSON.stringify(mappedUser),
      );
    }

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    return { success: true };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out from Supabase", err);
    } finally {
      localStorage.removeItem(localStorageKeys.authUser);
      setUser(null);
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  };

  const recoverPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    return { success: true };
  };

  const resetPassword = async (data: { newPassword: string; code: string }) => {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    return { success: true };
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      recoverPassword,
      resetPassword,
    }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
