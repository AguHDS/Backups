import { createFileRoute } from "@tanstack/react-router";
import { RequireNoAuth } from "@/lib/router/guards";
import { SignIn } from "@/features/auth";

export const Route = createFileRoute("/sign-in")({
  component: SignInRoute,
});

function SignInRoute() {
  return (
    <RequireNoAuth>
      <SignIn />
    </RequireNoAuth>
  );
}
