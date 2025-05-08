import React, { createContext, useEffect, useState, useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Colors } from "../constants/Colors";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import { BASE_URL } from "../api";
import { ToastContainer } from "react-toastify";

import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getAuthToken = async () => {
    const data = userStorage.getItem(keys.user);
    return data?.token;
  };

  const validateToken = async (token) => {
    if (!token) return false;
    try {
      const response = await fetch(`${BASE_URL}/getclientaccountinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getAuthToken();

        if (!token) {
          // console.log("NO token found for auth provider logic");
          setIsAuthenticated(false);
          return;
        }

        const isValid = await validateToken(token);
        if (isValid) {
          const userData = userStorage.getItem(keys.user);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          userStorage.removeItem(keys.user);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    isAuthenticated,
    loading,
    user,
    setIsAuthenticated,
  };

  // Don't render anything until the initial auth check is complete
  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center ">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // No need for loading check here since AuthProvider handles it
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectTo;
    return (
      <Navigate
        to={from}
        replace
      />
    );
  }

  return children;
};

export { AuthProvider };
