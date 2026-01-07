import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/app/redux/features/slices/authSlice";
import { axiosClient } from "@/lib/http";

interface SessionUser {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

/**
 * Check if user has an active session on app load
 * This syncs Redux state with BetterAuth cookies
 */
export const useSessionCheck = () => {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Call BetterAuth session endpoint
        const response = await axiosClient.get<SessionUser>("/api/auth/get-session");
        
        if (response.data?.user) {
          // User has active session, update Redux
          dispatch(setAuth({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role || "user",
          }));
        }
      } catch (error) {
        // No active session or error, do nothing (user stays logged out)
        if(error) {
          console.debug("Session check error:", error);
        }
        console.debug("No active session found");
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [dispatch]);

  return { isChecking };
};
