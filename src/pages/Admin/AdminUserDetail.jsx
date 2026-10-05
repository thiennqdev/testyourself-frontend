// src/pages/Admin/AdminUserDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dữ liệu mock, bạn thay bằng API gọi dữ liệu user
  const [user, setUser] = useState({
    name: "Nguyen Quang Thien",
    desc: "Course description. Donec ullamcorper nulla non metus auctor fringilla. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.",
    image: "",
  });
  const [quizzes, setQuizzes] = useState([
    { id: 1, name: "Course 1", questions: 12, author: "Text", progress: 75 },
    { id: 2, name: "Course 2", questions: 32, author: "Text", progress: 30 },
    { id: 3, name: "Course 3", questions: 17, author: "Text", progress: 100 },
    { id: 4, name: "Course 4", questions: 31, author: "Text", progress: 10 },
    { id: 5, name: "Course 5", questions: 25, author: "Text", progress: 30 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-10">
      {/* Top nav */}
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-gray-200 rounded-full text-lg"
        >
          &#8592;
        </button>
        <span className="font-bold">ADMIN</span> /
        <span className="text-black font-bold">Users</span>
      </div>

      {/* Header */}
      <div className="bg-gray-100 rounded-xl flex items-center px-10 py-8 mb-8 relative">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
          <p className="max-w-xl text-gray-600 text-base">{user.desc}</p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="rounded-full bg-gray-200 w-60 h-60 flex items-center justify-center">
            {/* Placeholder cho avatar/image */}
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="#e5e7eb" />
              <path d="M8 11a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" fill="#cbd5e1" />
              <rect
                x="5"
                y="16"
                width="14"
                height="3"
                rx="1.5"
                fill="#cbd5e1"
              />
            </svg>
          </div>
        </div>
        <button className="absolute right-10 top-8 bg-red-500 text-white rounded-full px-7 py-2 font-bold hover:bg-red-600 transition">
          Delete
        </button>
      </div>

      {/* Quizzes table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">Quizzes</div>
          <button className="bg-teal-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-teal-600 transition">
            <HiOutlinePencil className="text-lg" /> Edit
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-bold text-left w-10">?</th>
              <th className="px-4 py-3 font-bold text-left">Name</th>
              <th className="px-4 py-3 font-bold text-left">Questions</th>
              <th className="px-4 py-3 font-bold text-left">Author</th>
              <th className="px-4 py-3 font-bold text-left">Progress</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <FaUserGraduate className="text-teal-500 text-xl" />
                </td>
                <td className="px-4 py-3 font-medium">{quiz.name}</td>
                <td className="px-4 py-3">{quiz.questions}</td>
                <td className="px-4 py-3">{quiz.author}</td>
                <td className="px-4 py-3">{quiz.progress}%</td>
                <td className="px-4 py-3 text-right">&gt;</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex justify-between text-gray-400 text-xs">
          <div>1 - 5 of 123</div>
          <button className="text-teal-500 font-semibold hover:underline">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}
