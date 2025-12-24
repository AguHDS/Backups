import type { ReactNode } from "react";
import { redirect } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";

/**
 * Componente guard para rutas que requieren autenticación
 * Redirige a / si no está autenticado
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    throw redirect({
      to: "/",
      replace: true,
    });
  }

  return <>{children}</>;
};

/**
 * Componente guard para rutas que requieren NO estar autenticado
 * Redirige a /dashboard si ya está autenticado
 */
export const RequireNoAuth = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    throw redirect({
      to: "/dashboard",
      replace: true,
    });
  }

  return <>{children}</>;
};
