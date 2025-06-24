import type {
  AdminLoginCredentials,
  Driver,
  DriverLoginCredentials,
  LoginResponse,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const authApi = {
  async login(
    type: "admin" | "driver",
    credentials: AdminLoginCredentials | DriverLoginCredentials
  ): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/${type}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Email ou senha inválidos");
    }

    return response.json();
  },

  async getDrivers(): Promise<Driver[]> {
    const response = await fetch(`${API_URL}/drivers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar entregadores");
    }

    return response.json();
  },
};
