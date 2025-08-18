import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./auth";
import type { ReactElement } from "react";

export function PrivateRoute({ children }: { children: ReactElement }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}
