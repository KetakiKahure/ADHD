import React, { useEffect, useRef, useState } from "react";

/**
 * TasksAndTimer.jsx
 * - Add Task input + button
 * - Persist tasks in localStorage (key = "tasks")
 * - Check/uncheck tasks (completedAt stored)
 * - Simple Pomodoro timer (25m default), start/pause/reset
 * - When a pomodoro completes, push a session into localStorage (key = "pomodoroSessions")
 * - When task completed or session finished, update gamification in localStorage (simple points + streak)
 */

// simple storage helpers (local-only)
const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const push = (key, item) => {
  const arr = read(key, []);
  arr.unshift(item);
  write(key, arr);
  return arr;
};

// gamification updater (points & streak)
const updateGamificationOnActivity = (points = 0) => {
  const key = "gamification";
  const g = read(key, { points: 0, streakDays: 0, lastCompletedDate: null, badges: [] });
  g.points = (g.points || 0) + points;

  const today = new Date().toISOString().slice(0, 10);
  if (g.lastCompletedDate === today) {
    // already counted today
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (g.lastCompletedDate === yesterday) g.streakDays = (g.streakDays || 0) + 1;
    else g.streakDays = 1;
    g.lastCompletedDate = today;
  }

  if (g.points >= 100 && !g.badges.includes("100-points")) g.badges.push("100-points");
  write(key, g);
};

// unique id
const uid = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export default function TasksAndTimer() {
  const [tasks, setTasks] = useState(() => read("tasks", [
    { id: uid(), text: "Complete DSA practice", done: false, createdAt: Date.now() },
    { id: uid(), text: "Work on Mood Input module", done: false, createdAt: Date.now() },
  ]));

  const [newTaskText, setNewTaskText] = useState("");
  const [timer, setTimer] = useState(() => read("pomodoroDefault", 25 * 60)); // seconds
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  // persist tasks whenever they change
  useEffect(() => {
    write("tasks", tasks);
  }, [tasks]);

  // countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            // session complete
            const end = Date.now();
            const duration = sessionStartRef.current ? Math.round((end - sessionStartRef.current) / 1000) : 25 * 60;
            const session = {
              id: uid(),
              start: sessionStartRef.current || end - duration * 1000,
              end,
              durationSec: duration,
              createdAt: Date.now(),
            };
            push("pomodoroSessions", session);
            updateGamificationOnActivity(5); // +5 points for finishing a pomodoro
            // reset timer to default (25min)
            const defaultSec = read("pomodoroDefault", 25 * 60);
            setTimer(defaultSec);
            sessionStartRef.current = null;
            // optionally: prompt for focus rating - implement later
          }
          return Math.max(t - 1, 0);
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Add a new task
  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    const t = { id: uid(), text, done: false, createdAt: Date.now() };
    setTasks((prev) => [t, ...prev]);
    setNewTaskText("");
  };

  // toggle task done/undone
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const done = !t.done;
        // if newly completed, award points
        if (done && !t.done) updateGamificationOnActivity(10); // +10 points per task
        return { ...t, done, completedAt: done ? Date.now() : null };
      })
    );
  };

  const startTimer = () => {
    sessionStartRef.current = Date.now();
    setIsRunning(true);
  };
  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };
  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    const defaultSec = read("pomodoroDefault", 25 * 60);
    setTimer(defaultSec);
    sessionStartRef.current = null;
  };

  // formatting
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-indigo-600">Tasks & Pomodoro</h2>
        <div className="text-sm text-gray-500">Points & streak update automatically</div>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
          placeholder="New task (press Enter or click Add)"
          className="flex-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={addTask}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <div className="max-h-36 overflow-auto mb-4">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400">No tasks yet — add your first task.</div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!t.done}
                    onChange={() => toggleTask(t.id)}
                    className="h-5 w-5 accent-indigo-500"
                  />
                  <span className={t.done ? "line-through text-gray-400" : ""}>{t.text}</span>
                </label>
                <div className="text-xs text-gray-400">
                  {t.done ? "Done" : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-3xl font-mono">{formatTime(timer)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => (isRunning ? pauseTimer() : startTimer())}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer} className="bg-gray-200 px-3 py-1 rounded-md">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
