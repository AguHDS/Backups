import { createRootRoute, Outlet } from "@tanstack/react-router";
import App from "@/app/App";
import { ModalProvider } from "@/shared/ui/Modal/context/ModalProvider";

function RootComponent() {
  return (
    <ModalProvider>
        <App>
          <Outlet />
        </App>
    </ModalProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
