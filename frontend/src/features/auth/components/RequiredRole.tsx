import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../app/redux/store";

interface RequireRoleProps {
  allowedRoles: ("user" | "admin")[];
}

// Allow access by role
export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const { isAuthenticated, userData } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !allowedRoles.includes(userData.role!)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};
