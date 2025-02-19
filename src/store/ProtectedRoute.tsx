import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute: React.FC = () => {
  const { role } = useAuth();

  return role ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
