import { createRootRoute, Outlet } from "@tanstack/react-router";
import App from "@/app/App";
import { ModalProvider } from "@/shared/ui/Modal/context/ModalProvider";
import { useSessionCheck } from "@/features/auth/hooks/useSessionCheck";
import { Modal, LoadingSpinner } from "@/shared";

function RootComponent() {
  // Check for active session on app load
  const { isChecking } = useSessionCheck();

  return (
    <ModalProvider>
      {isChecking && (
        <Modal isSpinner>
          <LoadingSpinner size="lg" />
        </Modal>
      )}
      <App>
        <Outlet />
      </App>
    </ModalProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
