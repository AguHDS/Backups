import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { queryClient } from "@/lib/query/queryClient";

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
  const isDevelopment = import.meta.env.VITE_QUERY_ENV === "development";

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProvider;
