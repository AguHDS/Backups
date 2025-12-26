import { createFileRoute, redirect } from "@tanstack/react-router";
import { AccountSettings } from "@/features/settings";
import { store } from "@/app/redux/store";

export const Route = createFileRoute("/account-settings/")({
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
  component: AccountSettingsRoute,
});

function AccountSettingsRoute() {
  return (
      <AccountSettings />
  );
}
