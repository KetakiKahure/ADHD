// src/store.js
import { create } from 'zustand'

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7)

const useStore = create((set, get) => ({
  // user
  user: localStorage.getItem('username') || null,
  login: (username) => { localStorage.setItem('username', username); set({ user: username }) },
  logout: () => { localStorage.removeItem('username'); set({ user: null }) },

  // points / gamification
  points: 0,
  addPoints: (n = 10) => set(state => ({ points: state.points + n })),

  // tasks
  tasks: [
    { id: makeId(), title: 'Start Focus Session', duration: 25, completed: false },
    { id: makeId(), title: 'Read 10 pages', duration: 20, completed: false },
  ],
  addTask: (title, duration = 20) => set(state => ({ tasks: [{ id: makeId(), title, duration, completed: false }, ...state.tasks] })),
  toggleTask: (id) => set(state => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),
  deleteTask: (id) => set(state => ({ tasks: state.tasks.filter(t => t.id !== id) })),

  // moods
  moods: [], // { id, mood, note, timestamp }
  addMood: (mood, note = '') => set(state => ({ moods: [{ id: makeId(), mood, note, timestamp: Date.now() }, ...state.moods] })),

  // recommended pomodoro
  recommendedPomodoro: 25,
  setRecommendedPomodoro: (d) => set({ recommendedPomodoro: d }),

  // placeholder fetchers (keeps older code compatible)
  fetchTasks: () => {},
  fetchMoods: () => {},
  fetchPoints: () => {},
}))

export default useStore
