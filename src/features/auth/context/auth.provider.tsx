import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { AuthContext, authReducer, initialState } from "./auth.context";
import { message } from "antd";
import type {
  AdminLoginCredentials,
  DriverLoginCredentials,
} from "../types/auth";
import { authApi } from "../services/auth.service";
import { setTokenExpiredCallback } from "../../../shared/services/api.service";
import { isTokenExpired } from "../../../shared/utils/token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    isLoading: true,
  });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        // Verificar se o token está expirado
        if (isTokenExpired(storedToken)) {
          // Token expirado, limpar dados e não autenticar
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");
          dispatch({ type: "LOADING_COMPLETE" });
        } else {
          // Token válido, autenticar usuário
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              accessToken: storedToken,
              role: (localStorage.getItem("userRole") as string) || "",
              userId: parseInt(localStorage.getItem("userId") || "0"),
            },
          });
        }
      } else {
        dispatch({ type: "LOADING_COMPLETE" });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (
      type: "admin" | "driver",
      credentials: AdminLoginCredentials | DriverLoginCredentials
    ) => {
      try {
        dispatch({ type: "LOGIN_START" });
        const response = await authApi.login(type, credentials);

        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("userRole", response.role);
        localStorage.setItem("userId", response.userId.toString());

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            accessToken: response.access_token,
            role: response.role,
            userId: response.userId,
          },
        });

        messageApi.success("Login realizado com sucesso!");
      } catch (error) {
        dispatch({ type: "LOGIN_FAILURE" });
        messageApi.error(
          error instanceof Error ? error.message : "Falha ao realizar login"
        );
      }
    },
    [messageApi]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    dispatch({ type: "LOGOUT" });
    messageApi.success("Logout realizado com sucesso!");
  }, [messageApi]);

  const handleTokenExpired = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    dispatch({ type: "TOKEN_EXPIRED" });
    messageApi.warning("Sua sessão expirou. Faça login novamente.");
  }, [messageApi]);

  // Configurar o callback para tokens expirados
  useEffect(() => {
    setTokenExpiredCallback(handleTokenExpired);
  }, [handleTokenExpired]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      handleTokenExpired,
    }),
    [login, logout, handleTokenExpired, state]
  );

  return (
    <AuthContext.Provider value={value}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};
