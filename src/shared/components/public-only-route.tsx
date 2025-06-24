import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/use-auth";
import LoadingFallback from "./loading-fallback";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicOnlyRoute = ({
  children,
  redirectTo = "/",
}: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
