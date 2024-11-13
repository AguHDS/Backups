//utils
import { Route, Routes, Navigate } from "react-router-dom";

//pages
import { Home, NotFound, SignIn, SignUp } from "./pages";

//redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/*" element={<Navigate to="NotFound" />} />
            <Route path="/NotFound" element={<NotFound />} />
          </Routes>
      </Provider>
    </>
  );
};

export default App;
