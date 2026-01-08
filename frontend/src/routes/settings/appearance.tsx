import { createFileRoute } from "@tanstack/react-router";
import { AppearanceSettingsPage } from "@/features/settings";

export const Route = createFileRoute("/settings/appearance")({
  component: AppearanceSettingsPage,
});
