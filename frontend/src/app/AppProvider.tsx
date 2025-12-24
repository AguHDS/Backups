import { RouterProvider, createRouter } from "@tanstack/react-router";
import { store } from "./redux/store";
import { Provider } from "react-redux";

// Importar la ruta raíz generada
import { routeTree } from "@/routeTree.gen";

// Crear el router
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Registrar el router para type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppProvider = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default AppProvider;
