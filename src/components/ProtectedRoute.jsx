import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu yêu cầu role cụ thể mà role hiện tại không khớp
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
