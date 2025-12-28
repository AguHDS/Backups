import { createRootRoute, Outlet } from "@tanstack/react-router";
import App from "@/app/App";
import { ModalProvider } from "@/shared/ui/Modal/context/ModalProvider";
import { PersistLogin } from "@/features/auth";

function RootComponent() {
  return (
    <ModalProvider>
      <PersistLogin>
        <App>
          <Outlet />
        </App>
      </PersistLogin>
    </ModalProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
