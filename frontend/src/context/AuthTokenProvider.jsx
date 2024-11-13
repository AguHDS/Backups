/* import { useState, createContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const AuthContext = createContext({});

export const AuthTokenProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [shouldVerifyToken, setShouldVerifyToken] = useState(true);

  const { data, isLoading, status, error, fetchData } = useFetch();

  const verifyToken = async () => {
    fetchData("http://localhost:3001/verify-token", {
      method: "GET",
      credentials: "include",
    });

    if (status === 200) {
      setIsAuthenticated(true);
      setUserData(data);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (shouldVerifyToken) {
      verifyToken();
      setShouldVerifyToken(false);
    }
  }, [shouldVerifyToken]);

  useEffect(() => {
    if (!shouldVerifyToken) {
      setUserData(data);
      console.log(userData);
    }
  }, [userData, data]);

  const login = () => {
    setIsAuthenticated(true);
    setShouldVerifyToken(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout, login, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 */