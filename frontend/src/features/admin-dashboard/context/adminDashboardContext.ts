import { useContext } from "react";
import { AdminDashboardContext } from "./AdminDashboardProvider";

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error(
      "useAdminDashboard must be used within AdminDashboardProvider"
    );
  }
  return context;
};
