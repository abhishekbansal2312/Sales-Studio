import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set authorization header for all future requests
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.token}`;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });

      localStorage.setItem("user", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/users", { name, email, password });

      localStorage.setItem("user", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const getUserProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch user profile",
      };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
