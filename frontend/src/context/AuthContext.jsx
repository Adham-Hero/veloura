import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("veloura_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (userData) => {
    setUser(userData);
    localStorage.setItem("veloura_user", JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("veloura_user");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
