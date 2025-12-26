import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "@/views/dashboard";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => {
    const state = store.getState();
    const hasSession = localStorage.getItem("hasSession") === "true";
    const isAuthenticated = state.auth.isAuthenticated;

    //if there's session in localstorage, PersistLogin will handle it
    if (!isAuthenticated && !hasSession) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: DashboardRoute,
});
function DashboardRoute() {
  return <Dashboard />;
}
