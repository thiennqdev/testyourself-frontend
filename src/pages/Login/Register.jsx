import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: username.trim(),
        email: email.trim(),
        password,
        name: name.trim() || username.trim(),
      });
      toast.success('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
      <main className="w-full max-w-md flex flex-col items-center">
        <img
          alt="Logo"
          className="mb-6"
          height="48"
          src="/src/assets/Logo.png"
          width="48"
        />

        <h1 className="text-center text-black text-xl font-medium mb-4">
          Create a new account
        </h1>

        <form onSubmit={handleRegister} className="w-full max-w-xs mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Display Name"
            className="w-full mb-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-xs flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Already have an account?
          <span className="ml-1 font-medium text-emerald-600">Login</span>
        </button>
      </main>
    </div>
  );
};

export default Register;

