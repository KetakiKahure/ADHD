// mockApi.js — simulates backend APIs with fake data
import { v4 as uuidv4 } from 'uuid';

// Fake task data
let tasks = [
  { id: uuidv4(), title: 'Study React', completed: false, duration: 25 },
  { id: uuidv4(), title: 'Pomodoro Practice', completed: true, duration: 25 },
  { id: uuidv4(), title: 'Write Journal', completed: false, duration: 15 },
];

// Fake mood data
let moods = [
  { id: uuidv4(), mood: '😊', note: 'Feeling good', ts: Date.now() - 86400000 },
  { id: uuidv4(), mood: '😌', note: 'Relaxed', ts: Date.now() },
];

// Fake points
let points = 120;

// Fake sessions
let sessions = [
  { id: uuidv4(), taskId: tasks[0].id, duration: 25, completed: true, ts: Date.now() },
];

// --------------- API functions ---------------

// Tasks
export const getTasks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(tasks), 500); // simulate network delay
  });
};

export const addTask = async (title, duration = 25) => {
  const newTask = { id: uuidv4(), title, completed: false, duration };
  tasks.push(newTask);
  return new Promise((resolve) => setTimeout(() => resolve(newTask), 500));
};

// Moods
export const getMoods = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(moods), 500));
};

export const addMood = async (mood, note = '') => {
  const newMood = { id: uuidv4(), mood, note, ts: Date.now() };
  moods.push(newMood);
  return new Promise((resolve) => setTimeout(() => resolve(newMood), 500));
};

// Points
export const getPoints = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(points), 300));
};

export const addPoints = async (pts) => {
  points += pts;
  return new Promise((resolve) => setTimeout(() => resolve(points), 300));
};

// Sessions
export const getSessions = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(sessions), 500));
};

export const addSession = async (session) => {
  const newSession = { id: uuidv4(), ...session, ts: Date.now() };
  sessions.push(newSession);
  return new Promise((resolve) => setTimeout(() => resolve(newSession), 500));
};
