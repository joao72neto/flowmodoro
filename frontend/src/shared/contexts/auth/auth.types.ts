export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recoverPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (data: {
    newPassword: string;
    code: string;
  }) => Promise<{ success: boolean; error?: string }>;
}
