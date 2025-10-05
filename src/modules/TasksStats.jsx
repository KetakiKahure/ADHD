// src/modules/TasksStats.jsx
import React, { useEffect, useState } from "react";
import { read } from "../utils/storage";

export default function TasksStats() {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const tasks = read("tasks") || [];
      setTotal(tasks.length);
      setCompleted(tasks.filter(t => t.completedAt).length);
    };

    // Initial fetch
    updateStats();

    // Poll localStorage every 500ms for changes
    const interval = setInterval(updateStats, 500);
    return () => clearInterval(interval);
  }, []);

  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 relative">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">
        Task Progress
      </h3>

      {/* Progress bar background */}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden relative">
        {/* Progress fill */}
        <div
          className="h-6 bg-pink-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Animated student icon */}
        <div
          className="absolute top-0 left-0 h-6 w-6 flex items-center justify-center transform transition-all duration-500 ease-out"
          style={{ left: `calc(${progress}% - 0.75rem)` }} // adjust for icon width
        >
          <span role="img" aria-label="student" className="text-xl animate-bounce">
            🎓
          </span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {completed} of {total} tasks completed
      </div>
    </div>
  );
}
