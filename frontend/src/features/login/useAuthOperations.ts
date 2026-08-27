import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../shared/contexts/auth/auth.context";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await login(data),
  });
};

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
  });
};

export const useRegister = () => {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => await register(data),
  });
};

export const useRecoverPassword = () => {
  const { recoverPassword } = useAuth();

  return useMutation({
    mutationFn: async (email: string) => await recoverPassword(email),
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
    }) => await resetPassword({ newPassword, code }),
  });
};
