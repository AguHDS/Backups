import { Route, Routes, Navigate } from "react-router-dom";

//components
import { 
  NavBar, 
  ProtectedRoute, 
  PersistLogin, 
  NotFound 
} from "./components";

//pages
import {
  Dashboard,
  Home,
  SignIn,
  SignUp,
  AccountSettings,
  Profile,
} from "./pages";

//redux
import { store } from "./redux/store";
import { Provider } from "react-redux";

//context
import { ModalProvider } from "./components/modal/context/ModalContext";

const App = () => {
  console.log("app rendered");

  return (
    <>
      <Provider store={store}>
        <ModalProvider>
          <NavBar />
          <Routes>
            {/* public routes */}
            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/profile/:username" element={<Profile />} />

              {/* private routes */}

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account-settings" element={<AccountSettings />} />
              </Route>
            </Route>

            <Route path="/*" element={<Navigate to="NotFound" />} />
            <Route path="/NotFound" element={<NotFound />} />
          </Routes>
        </ModalProvider>
      </Provider>
    </>
  );
};

export default App;
