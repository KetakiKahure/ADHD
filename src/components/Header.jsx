// src/components/Header.jsx
import React from 'react'
import useStore from '../store'
import MoodInput from './MoodInput'
import { useNavigate } from 'react-router-dom'

export default function Header(){
  const points = useStore(s => s.points)
  const logout = useStore(s => s.logout)
  const navigate = useNavigate()

  const doLogout = () => { logout && logout(); localStorage.removeItem('username'); navigate('/') }

  return (
    <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300">FocusWave</h1>
        <span className="hidden md:inline text-sm text-gray-500">— calm, focus & progress</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white/90 px-3 py-2 rounded-xl shadow-sm border border-purple-50">
          <div className="text-xs text-gray-500">Points</div>
          <div className="text-sm font-semibold text-purple-600 px-2 py-1 rounded-md bg-purple-50">{points}</div>
        </div>

        <div className="bg-white/90 rounded-xl shadow-sm px-3 py-2 border border-purple-50">
          <MoodInput compact />
        </div>

        <button onClick={doLogout} className="ml-2 bg-transparent text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md border border-transparent hover:border-gray-200 transition">Logout</button>
      </div>
    </header>
  )
}
