import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard } from "@/features/admin-dashboard";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/admin-dashboard/")({
  beforeLoad: () => {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;
    const user = state.auth.user;

    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      throw redirect({
        to: "/unauthorized",
        replace: true,
      });
    }

    if (user?.role !== "admin") {
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
