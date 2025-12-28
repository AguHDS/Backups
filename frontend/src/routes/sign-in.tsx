import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@/features/auth";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/sign-in")({
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
  component: SignInRoute,
});

function SignInRoute() {
  return <SignIn />;
}
