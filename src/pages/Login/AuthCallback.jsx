import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return; // Chỉ cho chạy 1 lần
    hasNavigated.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const isNewRaw = params.get("is_new");
    const isNew = isNewRaw === "true";

    console.log("[AuthCallback] URL params:", { token, is_new: isNewRaw, isNew });

    if (token) {
      // Lưu localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("name", params.get("name") || "");
      localStorage.setItem("username", params.get("username") || "");
      localStorage.setItem("email", params.get("email") || "");
      localStorage.setItem("role", params.get("role") || "");
      if (params.get("user_id")) localStorage.setItem("user_id", params.get("user_id"));

      if (isNew) {
        console.log("[AuthCallback] Navigate to /complete-profile");
        navigate("/complete-profile");
      } else {
        console.log("[AuthCallback] Navigate to /dashboard");
        navigate("/dashboard");
      }
    } else {
      console.log("[AuthCallback] No token found, navigate to /login");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}