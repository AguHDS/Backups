import { Route, Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";

//components
import { RoutesWithNotFound } from "./RoutesWithNotFound"
import {
  SignUp,
  SignIn,  
  PersistLogin, 
  ProtectedRoute,
  Home,
  Profile,
  AccountSettings,
  Dashboard,
} from "../../features";

//redux 
import { useSelector } from "react-redux";

export const AppRouter = () => {
const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
