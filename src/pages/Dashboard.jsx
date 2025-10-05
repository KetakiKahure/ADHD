import React from "react";
import { Link } from "react-router-dom";

// Modules
import TasksAndTimer from "../modules/TasksAndTimer";
import MoodModule from "../modules/MoodModule";
import Gamification from "../modules/Gamification";
import TasksStats from "../modules/TasksStats"; // New: task progress bar
import MoodFocusPlaceholder from "../modules/MoodFocusPlaceholder"; // Mood vs Focus placeholder

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300">
            FocusWave
          </h1>
          <div className="text-xs text-gray-500 mt-1">Welcome — your workspace</div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analytics"
            className="text-sm px-3 py-2 rounded-lg bg-white/90 backdrop-blur-md border hover:shadow transition"
            title="Open full analytics"
          >
            View Analytics
          </Link>

          <button
            onClick={logout}
            className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Compact responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tasks & Timer - primary (span 2) */}
        <div className="md:col-span-2">
          <TasksAndTimer />
        </div>

        {/* Mood module - compact */}
        <div>
          <MoodModule />
        </div>

        {/* Bottom row: Gamification + TasksStats */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Gamification />
          <TasksStats /> {/* <-- new progress bar */}
        </div>

        {/* Mood vs Focus creative placeholder */}
        <div>
          <MoodFocusPlaceholder />
        </div>
      </div>
    </div>
  );
}
