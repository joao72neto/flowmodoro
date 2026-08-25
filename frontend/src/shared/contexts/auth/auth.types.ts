export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: { email: string; name?: string }) => void;
  logout: () => void;
}
