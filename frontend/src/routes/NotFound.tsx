import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/shared";

export const Route = createFileRoute("/NotFound")({
  component: NotFoundRoute,
});

function NotFoundRoute() {
  return <NotFound />;
}
