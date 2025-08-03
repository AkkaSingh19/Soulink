import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/signin" replace />;
}
