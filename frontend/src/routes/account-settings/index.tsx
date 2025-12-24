import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/lib/router/guards";
import { AccountSettings } from "@/features/settings";

export const Route = createFileRoute("/account-settings/")({
  component: AccountSettingsRoute,
});

function AccountSettingsRoute() {
  return (
    <RequireAuth>
      <AccountSettings />
    </RequireAuth>
  );
}
