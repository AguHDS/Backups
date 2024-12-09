import { useEffect } from "react";

//utils
import { Route, Routes, Navigate } from "react-router-dom";

//components
import { NavBar, ProtectedRoute } from "./components/common/";

//pages
import {
  Home,
  NotFound,
  SignIn,
  SignUp,
  AccountSettings,
  Dashboard,
  Profile,
} from "./pages";

//redux
import { store } from "./redux/store";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";

const App = () => {
  console.log("app rendereado x1");
  const { status } = useSelector((state) => state.auth); //para testing

  useEffect(() => { //para testing
    console.log("Status in redux changed:", status);
  }, [status]);

  return (
    <>
      <Provider store={store}>
        <NavBar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />

          {/* protected routes */}
          <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/account-settings" element={ <ProtectedRoute> <AccountSettings /> </ProtectedRoute>} />

          <Route path="/*" element={<Navigate to="NotFound" />} />
          <Route path="/NotFound" element={<NotFound />} />
        </Routes>
      </Provider>
    </>
  );
};

export default App;