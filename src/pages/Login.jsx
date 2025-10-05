// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock credentials
  const MOCK_USER = { username: 'user', password: 'prags123' };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4">
      <h1 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300 mb-12">
        FocusWave
      </h1>
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-full max-w-md border border-purple-200"
      >
        <h2 className="text-4xl font-semibold mb-8 text-center text-pink-600">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 mb-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-lg"
        />

        {error && <div className="text-red-500 mb-5 text-sm">{error}</div>}

        {/* Forgot password link */}
        <div className="text-right mb-5">
          <button
            type="button"
            onClick={() => alert('Forgot password flow not implemented yet')}
            className="text-sm text-purple-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-400 text-white p-4 rounded-xl hover:bg-pink-500 transition font-medium text-lg"
        >
          Login
        </button>

        {/* Mock credentials for testing */}
        <div className="mt-5 text-sm text-gray-500 text-center">
          Mock Username: <span className="font-semibold">{MOCK_USER.username}</span> | Password: <span className="font-semibold">{MOCK_USER.password}</span>
        </div>
      </form>
    </div>
  );
}
