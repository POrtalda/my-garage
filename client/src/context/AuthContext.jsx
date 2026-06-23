import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("my-garage-auth");

    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const saveAuth = (authData) => {
    const nextAuth = {
      user: authData.user,
      token: authData.token,
    };

    setAuth(nextAuth);
    localStorage.setItem("my-garage-auth", JSON.stringify(nextAuth));
  };

  const register = async (userData) => {
    const result = await registerUser(userData);
    saveAuth(result);
    return result;
  };

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    saveAuth(result);
    return result;
  };

  const logout = () => {
    setAuth({
      user: null,
      token: "",
    });

    localStorage.removeItem("my-garage-auth");
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      register,
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}