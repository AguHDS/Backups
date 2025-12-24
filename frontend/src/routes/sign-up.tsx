import { createFileRoute } from "@tanstack/react-router";
import { RequireNoAuth } from "@/lib/router/guards";
import { SignUp } from "@/features/auth";

export const Route = createFileRoute("/sign-up")({
  component: SignUpRoute,
});

function SignUpRoute() {
  return (
    <RequireNoAuth>
      <SignUp />
    </RequireNoAuth>
  );
}
