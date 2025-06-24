import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/use-auth";
import LoadingFallback from "./loading-fallback";

interface ProtectedRoutePropsType {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRoutePropsType) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/autenticacao" replace />;
  }

  return <>{children}</>;
};
