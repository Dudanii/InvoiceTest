import React from "react";
import { createContext, useState } from "react";
import http from "../api/http";

export const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    const token = data.access_token;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const role = payload.role; // Extract role
  
    console.log("User Role:", role);
    // fetch profile (optional)
    setUser({email});
    setRole(role)
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthCtx.Provider value={{ user,role, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
