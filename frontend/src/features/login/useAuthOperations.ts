import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../shared/contexts/auth/auth.context";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      login(data),
  });
};

export const useRegister = () => {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => register(data),
  });
};

export const useRecoverPassword = () => {
  const { recoverPassword } = useAuth();

  return useMutation({
    mutationFn: async (email: string) => recoverPassword(email),
  });
};

export const useResetPassword = () => {
  const { resetPassword } = useAuth();

  return useMutation({
    mutationFn: async ({
      newPassword,
      code,
    }: {
      newPassword: string;
      code: string;
    }) => resetPassword({ newPassword, code }),
  });
};
