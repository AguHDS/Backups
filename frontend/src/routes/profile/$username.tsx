import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "@/features/profile";
import { PersistLogin } from "@/features/auth";

export const Route = createFileRoute("/profile/$username")({
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <PersistLogin>
      <Profile />
    </PersistLogin>
  );
}
