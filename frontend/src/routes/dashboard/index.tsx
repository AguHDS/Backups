import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "@/views/dashboard";
import { store } from "@/app/redux/store";
import { PersistLogin } from "@/features/auth";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => {
    const state = store.getState();
    const hasSession = localStorage.getItem("hasSession") === "true";
    const isAuthenticated = state.auth.isAuthenticated;

    // Permitir acceso si: 
    // 1. Ya está autenticado, O
    // 2. Hay una sesión guardada (PersistLogin la manejará)
    if (!isAuthenticated && !hasSession) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
    // Si hay sesión pero no autenticación aún, dejar que PersistLogin trabaje
  },
  component: DashboardRoute,
});
function DashboardRoute() {
  return (
    <PersistLogin>
      <Dashboard />
    </PersistLogin>
  );
}
