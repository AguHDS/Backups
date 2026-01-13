import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/features/settings";

export const Route = createFileRoute("/settings/account")({
  component: AccountSettingsPage,
});
