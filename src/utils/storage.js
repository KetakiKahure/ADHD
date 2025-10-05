// src/utils/storage.js
export const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const push = (key, item) => {
  const arr = read(key, []);
  arr.unshift(item);
  write(key, arr);
  return arr;
};

// Gamification helpers
export const readGamification = () => read("gamification", {
  points: 0,
  streakDays: 0,
  lastCompletedDate: null,
  badges: [],
});

export const writeGamification = (obj) => write("gamification", obj);
