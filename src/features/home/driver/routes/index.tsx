import { Suspense } from "react";
import type { RouteObject } from "react-router";
import LoadingFallback from "../../../../shared/components/loading-fallback";
import { ProtectedRoute } from "../../../../shared/components/protected-route";
import DriverDashboard from "../pages/home";

export const driverRoutes: RouteObject[] = [
  {
    path: "/driver",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute>
          <DriverDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
];
