import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if(username.trim() !== '') {
      // store username in localStorage (optional)
      localStorage.setItem('username', username)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Welcome to FocusWave</h2>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={username} 
          onChange={(e)=>setUsername(e.target.value)}
          className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="bg-indigo-500 text-white py-3 rounded hover:bg-indigo-600 transition">Login</button>
      </form>
    </div>
  )
}
