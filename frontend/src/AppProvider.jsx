import App from "./App";
import { AppRouter } from "./AppRouter";
import { BrowserRouter } from "react-router-dom";

//components
import { ModalProvider } from "./components/Modal/context/ModalContext";

//redux
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
