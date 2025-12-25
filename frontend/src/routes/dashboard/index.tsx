import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "@/views/dashboard";
import { store } from "@/app/redux/store";
import { PersistLogin } from "@/features/auth";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
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
