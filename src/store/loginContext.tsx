import React, { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

// Define the context type
type TContext = {
  isLogin: boolean;
  toggleLogin: () => void;
};

// Create the context with a default value
const LoginContext = React.createContext<TContext>({
  isLogin: false,
  toggleLogin: () => {}, // Placeholder function
});

export const LoginContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useLocalStorage("isLogin", false);

  // useCallback to memoize the toggle function and prevent unnecessary re-renders
  const toggleLogin = useCallback(() => {
    setIsLogin((prev) => !prev);
  }, [setIsLogin]);

  const loginValue: TContext = {
    isLogin,
    toggleLogin,
  };

  return (
    <LoginContext.Provider value={loginValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
