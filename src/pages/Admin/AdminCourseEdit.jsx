// --- FILE: AdminCourseEdit.jsx ---

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Component giờ đây nhận props thay vì tự fetch data
export default function AdminCourseEdit({ course, onSave, onCancel }) {
  // State để quản lý các trường của form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // useEffect để điền dữ liệu vào form khi prop 'course' được truyền vào
  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description);
      // Nếu có ảnh cũ, hiển thị nó
      if (course.image) {
        setPreviewUrl(`http://localhost:5000/${course.image}`);
      } else {
        setPreviewUrl(null);
      }
      // Reset file ảnh đã chọn
      setImageFile(null);
    }
  }, [course]);

  // Không cần useEffect để fetch data nữa

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Gọi hàm onSave được truyền từ cha (AdminDashboard)
    // Truyền cả formData và ID của course
    onSave(formData, course.id);
  };

  // Nếu không có course được truyền vào, không render gì cả
  if (!course) return null;

  return (
    // Đây là phần Modal: một lớp nền mờ và một box nội dung ở giữa
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-md shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Edit Course Info</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">Image</label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mb-2 w-full max-h-48 object-contain"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button" // Quan trọng: type="button" để không submit form
              onClick={onCancel} // Gọi hàm onCancel khi nhấn nút
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}