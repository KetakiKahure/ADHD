// src/modules/Gamification.jsx
import React, { useState, useEffect } from "react";
import { readGamification, read } from "../utils/storage";

export default function Gamification() {
  const [g, setG] = useState(() => readGamification());
  useEffect(() => {
    const id = setInterval(() => setG(readGamification()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gamification</h3>
        <div className="text-sm text-gray-500">Streak: {g.streakDays || 0}d</div>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div>
          <div className="text-3xl font-bold">{g.points || 0}</div>
          <div className="text-xs text-gray-500">Points</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(g.badges || []).length === 0 ? (
            <div className="text-sm text-gray-400">No badges yet</div>
          ) : (g.badges.map(b => (
            <div key={b} className="px-3 py-1 bg-yellow-100 rounded-md text-sm">{b}</div>
          )))}
        </div>
      </div>
    </div>
  );
}
