import { createBrowserRouter } from "react-router";
import { authRoutes } from "../../features/auth/routes";
import { driverRoutes } from "../../features/home/driver/routes";
import { adminRoutes } from "../../features/home/admin/routes";
import Home from "../../features/home/home";
import { ProtectedRoute } from "../components/protected-route";

export const router = createBrowserRouter([
  ...authRoutes,
  ...driverRoutes,
  ...adminRoutes,
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);
