import { createFileRoute, redirect } from "@tanstack/react-router";
import { RequestPasswordResetPage } from "@/features/auth/pages/RequestPasswordResetPage";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/forgot-password")({
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
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  return <RequestPasswordResetPage />;
}
