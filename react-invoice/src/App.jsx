import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import Login from "./pages/login";
import Invoices from "./pages/invoices";
import Users from "./pages/Users";
import useAuth from "./auth/useAuth";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/invoices" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
