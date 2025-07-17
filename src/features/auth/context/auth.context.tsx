import { createContext } from "react";
import type {
  AdminLoginCredentials,
  AuthState,
  DriverLoginCredentials,
} from "../types/auth";

const initialState: AuthState = {
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  role: "",
  isLoading: true,
};

type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        accessToken: string;
        role: string;
        userId: number;
      };
    }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "TOKEN_EXPIRED" }
  | { type: "LOADING_COMPLETE" };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        role: action.payload.role,
        userId: action.payload.userId,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        userId: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    case "TOKEN_EXPIRED":
      return {
        ...initialState,
        isLoading: false,
      };
    case "LOADING_COMPLETE":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (
    type: "admin" | "driver",
    credentials: AdminLoginCredentials | DriverLoginCredentials
  ) => Promise<void>;
  logout: () => void;
  handleTokenExpired: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  handleTokenExpired: () => {},
});

export { initialState };
