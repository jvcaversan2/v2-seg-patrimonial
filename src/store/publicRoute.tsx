import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth";
import type { ReactElement } from "react";

export function PublicRoute({ children }: { children: ReactElement }) {
  const token = useAuthStore((s) => s.token);
  return token ? <Navigate to="/home" replace /> : children;
}
