import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        name,
      });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
      <main className="w-full max-w-md flex flex-col items-center">
        <img
          alt="Logo"
          className="mb-6"
          height="48"
          src="src/assets/Logo.png"
          width="48"
        />

        <h1 className="text-center text-black text-xl font-medium mb-4">
          Create a new account
        </h1>

        <form onSubmit={handleRegister} className="w-full max-w-xs mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Display Name"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
          >
            Register
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
