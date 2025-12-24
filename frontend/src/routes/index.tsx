import { createFileRoute, redirect } from "@tanstack/react-router";
import { store } from "@/app/redux/store";
import { Home } from "@/views/home";

export const Route = createFileRoute("/")({
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
  component: IndexRoute,
});

function IndexRoute() {
  return <Home />;
}