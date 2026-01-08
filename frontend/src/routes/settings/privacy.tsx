import { createFileRoute } from "@tanstack/react-router";
import { PrivacySettingsPage } from "@/features/settings";

export const Route = createFileRoute("/settings/privacy")({
  component: PrivacySettingsPage,
});
