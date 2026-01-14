import { createFileRoute, redirect } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: search.token ? String(search.token) : undefined,
    };
  },
  beforeLoad: () => {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;

    if (isAuthenticated) {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  return <ResetPasswordPage />;
}
