"use client";

import React, { createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext({
  isDark: true,
  toggleDark: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    Cookies.set("theme", "dark", { expires: 365 });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark: true, toggleDark: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
