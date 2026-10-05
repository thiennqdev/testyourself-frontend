import React, { useState, useEffect } from 'react';

export default function AdminUserEdit({ user, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || 'USER');
    }
  }, [user]);

  // Hàm này xử lý sự kiện submit khi nhấn nút Save Changes
  const handleSubmit = (e) => {
    e.preventDefault();  // Ngừng hành động mặc định của form (trang không reload)
    
    // Tạo đối tượng chứa dữ liệu cần gửi lên backend
    const updatedUserData = { name, role };

    // Gọi hàm onSave từ component cha (AdminDashboard)
    onSave(updatedUserData, user.id);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit User: <span className="font-normal text-gray-600">{user.username}</span></h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="name" className="block font-medium mb-1 text-gray-800">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 bg-gray-200"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block font-medium mb-1 text-gray-800">Username (Cannot be changed)</label>
            <input
              id="username"
              type="text"
              defaultValue={user.username || ''}
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-800 text-white cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label htmlFor="role" className="block font-medium mb-1 text-gray-800">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 bg-gray-200"
              disabled={user.role === 'ADMIN'} 
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="BANNED">BANNED</option>
            </select>
             {user.role === 'ADMIN' && (
                <p className="text-xs text-red-500 mt-1">Cannot change the role of an Admin.</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
