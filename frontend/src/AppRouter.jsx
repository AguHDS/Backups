import { Route, Navigate } from "react-router-dom";

//components
import { PersistLogin, ProtectedRoute, RoutesWithNotFound } from "./components";

import {
  SignUp,
  SignIn,
  Home,
  Profile,
  AccountSettings,
  Dashboard,
} from "./pages";

//redux 
import { useSelector } from "react-redux";

export const AppRouter = () => {
const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <RoutesWithNotFound>
      <Route element={<PersistLogin />}>
        {/* public routes */}
        <Route path="/" element={isAuthenticated ? (<Navigate to="/dashboard" />) : (<Home />)} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile/:username" element={<Profile />} />

        {/* private routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>
      </Route>
    </RoutesWithNotFound>
  );
};
