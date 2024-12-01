//utils
import { Route, Routes, Navigate } from "react-router-dom";

//components
import { NavBar } from "./components/common/";

//pages
import {
  Home,
  NotFound,
  SignIn,
  SignUp,
  Profile,
  AccountSettings,
} from "./pages";

//redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/*" element={<Navigate to="NotFound" />} />
          <Route path="/NotFound" element={<NotFound />} />
        </Routes>
      </Provider>
    </>
  );
};

export default App;
