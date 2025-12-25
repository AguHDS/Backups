import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUp } from "@/features/auth";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/sign-up")({
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
  component: SignUpRoute,
});

function SignUpRoute() {
  return <SignUp />;
}
