// src/pages/Analytics.jsx
import React, { useMemo } from "react";
import { Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { read } from "../utils/storage";
import { Link } from "react-router-dom";

// register required Chart.js pieces
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement);

const moodMap = { very_happy: 5, happy: 4, neutral: 3, sad: 2, angry: 1 };

// helper: group by date-key (YYYY-MM-DD)
const groupCountByDay = (items, getDateKey) => {
  const map = {};
  items.forEach((it) => {
    const k = getDateKey(it);
    map[k] = (map[k] || 0) + 1;
  });
  // return sorted arrays of days and counts (last 14 days)
  const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  const days = sorted.map((s) => s[0]);
  const counts = sorted.map((s) => s[1]);
  return { days, counts };
};

export default function Analytics() {
  // read data from localStorage via utils/storage.read
  const sessions = read("pomodoroSessions", []);
  const moods = read("moodEntries", []);

  // sessions per day (for sparkline)
  const sessionsByDay = useMemo(
    () =>
      groupCountByDay(sessions, (s) =>
        new Date(s.start).toISOString().slice(0, 10)
      ),
    [sessions]
  );

  // take last N days (14)
  const N = 14;
  const days = sessionsByDay.days.slice(-N);
  const counts = sessionsByDay.counts.slice(-N);

  // Sparkline chart data
  const sparkData = {
    labels: days,
    datasets: [
      {
        label: "Sessions",
        data: counts,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.15)",
        tension: 0.25,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const sparkOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index" } },
    scales: { x: { display: false }, y: { display: false } },
  };

  // Mood vs Focus points:
  // We will map each mood entry to a point. If you have session.focusRating captured,
  // it's better to match mood to nearest session and include focus. For now we show mood alone.
  const moodPoints = moods
    .slice(0, 100)
    .map((m, i) => {
      const xLabel = new Date(m.timestamp).toLocaleDateString();
      const y = moodMap[m.mood] || 3;
      return { x: xLabel, y, label: new Date(m.timestamp).toLocaleString() };
    })
    .reverse(); // recent first if needed

  // Scatter chart configuration (x is categorical - labels)
  const scatterData = {
    datasets: [
      {
        label: "Mood (1-5)",
        data: moodPoints.map((p) => ({ x: p.x, y: p.y, meta: p.label })),
        backgroundColor: "rgba(244,114,182,0.9)",
        pointRadius: 6,
      },
    ],
  };

  const scatterOptions = {
    parsing: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        ticks: { maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 10 },
        title: { display: true, text: "Date" },
      },
      y: {
        min: 0.8,
        max: 5.2,
        ticks: { stepSize: 1, callback: (v) => v },
        title: { display: true, text: "Mood (1=angry → 5=very happy)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.raw?.meta ?? "",
          label: (item) => `Mood: ${item.raw.y}`,
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline">
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-500">Sessions: {sessions.length} • Moods: {moods.length}</div>
          </div>
        </div>

        {/* Top row: sparkline + quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-lg p-4 border">
            <h3 className="text-sm text-gray-600 mb-2">Sessions (last {N} days)</h3>
            <div style={{ height: 100 }}>
              <Line data={sparkData} options={sparkOptions} />
            </div>
            <div className="text-xs text-gray-400 mt-2">Total sessions: {sessions.length}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border flex flex-col justify-between">
            <div>
              <h3 className="text-sm text-gray-600">Overview</h3>
              <div className="mt-3">
                <div className="text-lg font-semibold">{sessions.length}</div>
                <div className="text-xs text-gray-400">Total pomodoro sessions</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold">{moods.length}</div>
              <div className="text-xs text-gray-400">Mood entries</div>
            </div>
          </div>
        </div>

        {/* Mood vs Focus (scatter) */}
        <div>
          <h3 className="text-sm text-gray-600 mb-3">Mood vs (Focus) — recent entries</h3>
          <div className="bg-white rounded-lg p-4 border" style={{ minHeight: 260 }}>
            {moodPoints.length === 0 ? (
              <div className="text-sm text-gray-400">No mood entries yet — add mood entries to see this chart.</div>
            ) : (
              <div style={{ height: 240 }}>
                <Scatter data={scatterData} options={scatterOptions} />
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Mapping: angry=1 → very happy=5. Add a <span className="italic">focus rating (1–5)</span> after each pomodoro to build a true mood vs focus correlation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
