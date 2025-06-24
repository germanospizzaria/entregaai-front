import { Suspense } from "react";
import type { RouteObject } from "react-router";
import LoadingFallback from "../../../../shared/components/loading-fallback";
import { ProtectedRoute } from "../../../../shared/components/protected-route";
import AdminPage from "../pages/home";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
];
