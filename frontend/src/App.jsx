import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

//components
import { NavBar, ProtectedRoute, PersistLogin } from "./components";

//pages
import {
  Dashboard,
  Home,
  NotFound,
  SignIn,
  SignUp,
  AccountSettings,
  Profile,
} from "./pages";

//redux
import { store } from "./redux/store";
import { Provider } from "react-redux";

const App = () => {
  console.log("app rendereado x1");

  return (
    <>
      <Provider store={store}>
        <NavBar />
        <Routes>
          {/* public routes */}
        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* private routes */}
         
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/account-settings" element={<AccountSettings />} />
            </Route>
        </Route>

          <Route path="/*" element={<Navigate to="NotFound" />} />
          <Route path="/NotFound" element={<NotFound />} />
        </Routes>
      </Provider>
    </>
  );
};

export default App;