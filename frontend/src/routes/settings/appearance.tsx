import { createFileRoute } from "@tanstack/react-router";
import { AppearanceSettingsPage } from "@/features/settings/pages/AppearanceSettingsPage";

export const Route = createFileRoute("/settings/appearance")({
  component: AppearanceSettingsPage,
});
