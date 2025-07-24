import App from "../app/App";
import { AppRouter } from "./router/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "../shared/ui/Modal/ModalContext";
import { store } from "./redux/store";
import { Provider } from "react-redux";

const AppProvider = () => {
  return (
    <Provider store={store}>
      <ModalProvider>
        <BrowserRouter>
          <App>
            <AppRouter />
          </App>
        </BrowserRouter>
      </ModalProvider>
    </Provider>
  );
};

export default AppProvider;
