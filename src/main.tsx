import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./features/auth/context/auth.provider";
import { LayoutProvider } from "./shared/hooks/use-layout";
import { RouterProvider } from "react-router";
import { router } from "./shared/routes";
import { MessageProvider } from "./shared/hooks/use-message";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MessageProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </MessageProvider>
    </AuthProvider>
  </StrictMode>
);
