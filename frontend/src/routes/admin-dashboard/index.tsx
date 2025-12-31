import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard } from "@/features/admin-dashboard";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/admin-dashboard/")({
  beforeLoad: () => {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;
    const user = state.auth.user;

    // If authenticated, check admin role immediately
    if (isAuthenticated && user) {
      if (user.role !== "admin") {
        throw redirect({
          to: "/unauthorized",
          replace: true,
        });
      }
    }

    // If not authenticated and no session, redirect to unauthorized
    if (!isAuthenticated) {
      throw redirect({
        to: "/unauthorized",
        replace: true,
      });
    }
  },
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return <AdminDashboard />;
}
