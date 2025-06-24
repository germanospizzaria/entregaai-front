export interface Admin {
  id: number;
  nome: string;
  senha: string;
}

export interface Driver {
  id: number;
  nome: string;
  telefone: string;
  status: string;
  corridas: [];
}

export interface AuthState {
  userId: number | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: string;
  isLoading: boolean;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface DriverLoginCredentials {
  driverId: number;
  phoneLastDigits: string;
}

export interface LoginResponse {
  access_token: string;
  role: "admin" | "driver";
  userId: number;
  name: string;
}
