import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/login/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const { role, name, username: userName, access_token: token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', userName);
      localStorage.setItem('name', name);

      toast.success(`Login successful! Welcome, ${name || userName}`);

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Invalid username or password.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
      <main className="w-full max-w-md flex flex-col items-center">
        <img
          alt="Logo"
          className="mb-6"
          height="48"
          loading="lazy"
          src="/src/assets/Logo.png"
          width="48"
        />

        <h1 className="text-center text-black text-xl font-medium mb-4">
          Welcome to TestYourself
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-xs mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-xs flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.9 2.8 29.8 1 24 1 14.9 1 7.2 6.5 4.2 14.5l7.5 5.8C13.2 13.5 18.2 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24c0-1.7-.2-3.4-.5-5H24v9.5h12.8c-.5 3-2.1 5.6-4.6 7.3l7.5 5.8c4.4-4.1 7.3-10 7.3-17.6z"/>
            <path fill="#FBBC05" d="M11.7 20.3C11.2 18.8 11 17.2 11 15.5s.2-3.3.7-4.8l-7.5-5.8C1.5 8.2 0 11.7 0 15.5s1.5 7.3 4.2 10.7l7.5-5.9z"/>
            <path fill="#EA4335" d="M24 48c5.8 0 10.9-1.9 14.5-5.2l-7.5-5.8c-1.9 1.3-4.3 2-6.9 2-5.8 0-10.8-4-12.3-9.7l-7.5 5.8C7.2 41.5 14.9 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Login with Google
        </button>

        <p className="mt-4 text-sm text-gray-700">
          Don't have an account?{' '}
          <span
            className="text-emerald-600 font-semibold hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>

        <p className="mt-4 text-center text-xs text-gray-600 max-w-xs">
          By proceeding, you agree to our{' '}
          <a className="text-emerald-600 underline" href="#">
            terms & conditions
          </a>
        </p>
      </main>
    </div>
  );
};

export default Login;
