// src/modules/AnalyticsPreview.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { read } from "../utils/storage";

export default function AnalyticsPreview() {
  const sparkRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!sparkRef.current) return;

    // Destroy previous chart if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const moods = read("moodEntries") || [];
    const moodToScore = m => ({ very_happy: 5, happy: 4, neutral: 3, sad: 2, angry: 1 })[m] ?? 3;

    const last7 = moods.slice(0, 7).reverse();
    const labels = last7.map(m => new Date(m.timestamp).toLocaleDateString().slice(0, 5));
    const data = last7.map(m => moodToScore(m.mood));

    chartInstance.current = new Chart(sparkRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Mood Trend",
          data,
          borderColor: "purple",
          fill: false,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        elements: { point: { radius: 3 } },
        scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6">
      <h2 className="text-xl font-semibold mb-2 text-green-600">
        Mood Trend (Last 7 Days)
      </h2>
      <canvas ref={sparkRef} className="h-24 w-full"></canvas>
    </div>
  );
}
