import { Suspense } from "react";
import type { RouteObject } from "react-router";
import LoadingFallback from "../../../shared/components/loading-fallback";
import { AdminLogin } from "../pages/admin-login";
import { DriverLogin } from "../pages/driver-login";
import { UserTypeSelector } from "../pages/user-type-selector";
import { PublicOnlyRoute } from "../../../shared/components/public-only-route";

export const authRoutes: RouteObject[] = [
  {
    path: "/autenticacao",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicOnlyRoute>
          <UserTypeSelector />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/autenticacao/admin/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicOnlyRoute>
          <AdminLogin />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
  {
    path: "/autenticacao/driver/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicOnlyRoute>
          <DriverLogin />
        </PublicOnlyRoute>
      </Suspense>
    ),
  },
];
