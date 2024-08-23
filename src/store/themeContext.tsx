import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

// Define the context type
type ThemeType = {
  theme: string;
  toggleTheme: () => void;
};

// Create the context with default values
const ThemeContext = React.createContext<ThemeType>({
  theme: "light", // Default theme is set to "light"
  toggleTheme: () => {},
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const themeValue: ThemeType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
