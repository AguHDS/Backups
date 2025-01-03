import React from "react";
import ReactDOM from "react-dom/client";
import "./output.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./components/modal/context/ModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </Provider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
