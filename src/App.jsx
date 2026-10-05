import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

// Auth & onboarding pages
import WelcomePage from "./pages/Login/WelcomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import AuthCallback from "./pages/Login/AuthCallback";
import CompleteProfile from "./pages/User/CompleteProfile"; // ✅ Dùng cho complete-profile
import AdminUserDetail from "./pages/Admin/AdminUserDetail";
// Main app pages
import Dashboard from "./pages/User/Dashboard";
import CourseList from "./pages/User/CourseList";
import Quiz from "./pages/User/Quiz";
import QuizComplete from "./pages/User/QuizComplete";
import CourseBrowse from "./pages/User/CourseBrowse"; // ✅ Trang duyệt khóa học
import QuizizzPage from "./pages/User/QuizizzPage";
// Admin pages
import AdminQuizzEditor from "./pages/Admin/AdminQuizzEditor";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCourseEdit from "./pages/Admin/AdminCourseEdit";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public & Auth routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/browse" element={<CourseBrowse />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz/:id/complete" element={<QuizComplete />} />

        {/* Các trang yêu cầu đăng nhập (User / Admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id/quiz-editor" element={<QuizizzPage />} />
        </Route>

        {/* Các trang dành riêng cho Quản trị viên (ADMIN) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses/:id/edit" element={<AdminCourseEdit />} />
          <Route path="/admin/courses/:id/quiz-editor" element={<AdminQuizzEditor />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        </Route>

        {/* Route fallback: nếu không match route nào, redirect về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
