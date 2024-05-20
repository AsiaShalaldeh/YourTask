import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const isAuthenticated = localStorage.getItem("access_token") !== null;

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
