import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  UserLogin,
  UserLogout,
  UserAuthenticate,
  UserRegister,
} from "../services/supabaseAuth.js";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const role = user?.role || null;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await UserAuthenticate();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const register = async (full_name, email, password) => {
    try {
      const result = await UserRegister({ full_name, email, password });
      toast.success("Registration successful! Please check your email.");
      return result;
    } catch (error) {
      toast.error(error.message || "Register failed");
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await UserLogin({ email, password });
      setUser(userData);
      toast.success(`Welcome back, ${userData.full_name || 'User'}!`);
      return userData;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await UserLogout();
      setUser(null);
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    }
  };

  const value = useMemo(() => ({
    user,
    role,
    isLoggedIn,
    isAdmin,
    loading,
    login,
    logout,
    register,
    showLogin, 
    setShowLogin, 
    showUserMenu,
    setShowUserMenu,
  }), [user, loading, showLogin, showUserMenu]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthContextProvider");
  return context;
};