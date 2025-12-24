import { createFileRoute } from "@tanstack/react-router";
import { Unauthorized } from "@/shared/components";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedRoute,
});

function UnauthorizedRoute() {
  return <Unauthorized />;
}
