// src/modules/MoodFocusPlaceholder.jsx
import React, { useEffect, useState } from "react";
import { read } from "../utils/storage";

const moodColors = {
  very_happy: "#FFD700",
  happy: "#FFB347",
  neutral: "#C0C0C0",
  sad: "#87CEFA",
  angry: "#FF6B6B",
};

const moodLabels = {
  very_happy: "Very Happy",
  happy: "Happy",
  neutral: "Neutral",
  sad: "Sad",
  angry: "Angry",
};

export default function MoodFocusPlaceholder() {
  const [moodEntries, setMoodEntries] = useState([]);

  useEffect(() => {
    const fetchMoods = () => {
      const moods = read("moodEntries") || [];
      setMoodEntries(moods.slice(0, 10).reverse());
    };

    fetchMoods();
    const interval = setInterval(fetchMoods, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4">
      <h2 className="text-xl font-semibold mb-3 text-green-600">
        Mood Garden
      </h2>
      <div className="flex gap-6 overflow-x-auto py-4 items-end">
        {moodEntries.map((entry, idx) => {
          const stemHeight = 15 + (entry.focusRating ?? 3) * 8;
          const color = moodColors[entry.mood] ?? "#C0C0C0";

          return (
            <div
              key={idx}
              className="flex flex-col items-center group"
              title={`${moodLabels[entry.mood]} | Focus: ${entry.focusRating ?? 3}`}
            >
              {/* Flower */}
              <div
                className="relative w-8 h-8 mb-1 flex items-center justify-center"
                style={{ animation: `sway 3s ease-in-out infinite alternate ${idx * 0.2}s` }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-4 rounded-full"
                    style={{
                      backgroundColor: color,
                      transform: `rotate(${i * 72}deg) translateY(-6px)`,
                      transformOrigin: "bottom center",
                    }}
                  ></div>
                ))}
                {/* Center */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-white"
                ></div>
              </div>

              {/* Stem */}
              <div
                className="w-1 bg-green-500 rounded-full transition-all duration-500"
                style={{ height: `${stemHeight}px` }}
              ></div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes sway {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
          100% { transform: rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}
