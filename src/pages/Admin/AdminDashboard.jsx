// --- FILE: src/pages/Admin/AdminDashboard.jsx ---

import React, { useEffect, useState, useCallback } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminCourseEdit from "./AdminCourseEdit";
import AdminUserEdit from "./AdminUserEdit"; // Import component modal sửa user

// --- Các component phụ (TableHead, QuizzesTable, UsersTable) ---
function TableHead({ columns }) {
  return (
    <thead className="bg-gray-100 text-gray-700 text-base">
      <tr>
        {columns.map((col, i) => (
          <th key={i} className="px-4 py-3 font-bold text-left">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function QuizzesTable({ quizzes, onEditInfo, onEditQuiz, onDelete }) {
  return (
    <table className="w-full text-sm">
      <TableHead columns={["", "Name", "Owner ID", "Created", "Actions"]} />
      <tbody>
        {quizzes.map((quiz) => (
          <tr
            key={quiz.id}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3">
              <FaUserGraduate className="text-teal-500 text-xl" />
            </td>
            <td className="px-4 py-3 font-medium text-black">{quiz.name}</td>
            <td className="px-4 py-3 text-black">{quiz.owner_id}</td>
            <td className="px-4 py-3 text-black">
              {quiz.created_at?.slice(0, 10)}
            </td>
            <td className="px-4 py-3 text-right space-x-2">
              <button onClick={() => onEditInfo(quiz)} className="text-blue-600 hover:underline">Edit Info</button>
              <button onClick={() => onEditQuiz(quiz)} className="text-indigo-600 hover:underline">Edit Quiz</button>
              <button onClick={() => onDelete(quiz.id)} className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsersTable({ users, onEdit, onDelete }) {
    return (
        <table className="w-full text-sm">
            <TableHead columns={["", "Name", "Username", "Role", "ID", "Actions"]} />
            <tbody>
            {users.map((user) => (
                <tr key={user.id} className="border-b last:border-none hover:bg-gray-50 transition">
                    <td className="px-4 py-3"><FaUserGraduate className="text-teal-500 text-xl" /></td>
                    <td className="px-4 py-3 font-medium text-black">{user.name}</td>
                    <td className="px-4 py-3 text-black">{user.username}</td>
                    <td className="px-4 py-3 text-black">{user.role}</td>
                    <td className="px-4 py-3 text-black">{user.id}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => onEdit(user)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => onDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

// --- Component chính: AdminDashboard ---
export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // State để quản lý user đang được sửa
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Redirecting to login.");
      navigate("/login");
      return;
    }
    
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
      setQuizzes(res.data.courses || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data.";
      console.error("Failed to fetch dashboard data:", err);
      toast.error(errorMessage);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HÀM XỬ LÝ KHÓA HỌC (COURSE/QUIZ) ---
  const handleSaveChanges = async (formData, courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/admin/courses/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Course updated successfully!");
      setEditingCourse(null);
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update course.";
      console.error("Failed to update course:", err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/flashcards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quiz deleted successfully!");
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete quiz.";
      console.error("Failed to delete quiz:", err);
      toast.error(errorMessage);
    }
  };

  // --- HÀM XỬ LÝ NGƯỜI DÙNG (USER) ---
  const handleEditUser = (user) => {
    setEditingUser(user); // Mở modal edit bằng cách set state
  };
  
  const handleSaveUserChanges = async (updatedData, userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("User updated successfully!");
      setEditingUser(null); // Đóng modal sau khi lưu thành công
      await fetchData(); // Tải lại dữ liệu để cập nhật bảng
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update user.";
      console.error("Failed to update user:", err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is permanent!")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!");
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete user.";
      console.error("Failed to delete user:", err);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold text-teal-600 flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-8" />
          TestYourself
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="text-teal-500 hover:underline"
          >
            Exit Admin
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
        </div>
      </div>

      {/* Quizzes table */}
      <div className="bg-white rounded-xl shadow p-6 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">Quizzes</div>
        </div>
        <QuizzesTable
            quizzes={quizzes}
            onEditInfo={(quiz) => setEditingCourse(quiz)}
            onEditQuiz={(quiz) => navigate(`/admin/courses/${quiz.id}/quiz-editor`)}
            onDelete={handleDeleteQuiz}
        />
        <div className="mt-2 text-gray-400 text-xs">
          Tổng: {quizzes.length} quizzes
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">Users</div>
        </div>
        <UsersTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
        <div className="mt-2 text-gray-400 text-xs">
          Tổng: {users.length} users
        </div>
      </div>

      {/* MODALS: Render các component modal ở đây */}
      {editingCourse && (
        <AdminCourseEdit
          course={editingCourse}
          onSave={handleSaveChanges}
          onCancel={() => setEditingCourse(null)}
        />
      )}

      {editingUser && (
        <AdminUserEdit
          user={editingUser}
          onSave={handleSaveUserChanges}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}