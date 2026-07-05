"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { api } from "./api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      Cookies.remove("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => checkAuth(), 0);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.data.token, { expires: 3 });
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    window.location.href = "/";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "root",
    isAdmin: user?.role === "root" || user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
