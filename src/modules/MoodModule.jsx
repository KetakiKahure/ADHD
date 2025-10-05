// src/modules/MoodModule.jsx
import React, { useState } from "react";
import AnalyticsPreview from "./AnalyticsPreview";

export default function MoodModule() {
  const [selectedMood, setSelectedMood] = useState("");
  const [journal, setJournal] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const moodOptions = [
    { key: "very_happy", label: "😄" },
    { key: "happy", label: "🙂" },
    { key: "neutral", label: "😐" },
    { key: "sad", label: "😔" },
    { key: "angry", label: "😡" },
  ];

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image too large. Max 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const entry = {
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      journal,
      image: imageDataUrl,
    };
    const prev = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    prev.unshift(entry);
    localStorage.setItem("moodEntries", JSON.stringify(prev.slice(0, 50)));

    setSelectedMood("");
    setJournal("");
    setImageDataUrl(null);
    alert("Mood saved locally. Visualization reads from localStorage.");
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4">
      {/* Header with modal button */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-pink-600">Mood Input</h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-purple-500 hover:underline"
        >
          View Visualization
        </button>
      </div>

      {/* Mood selector */}
      <div className="mt-3 flex gap-3">
        {moodOptions.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelectedMood(m.key)}
            className={`text-2xl p-2 rounded-lg transition transform ${
              selectedMood === m.key
                ? "ring-2 ring-pink-300 scale-110"
                : "hover:scale-105"
            }`}
            title={m.key}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Journal */}
      <textarea
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        placeholder="Write a quick note (optional)..."
        className="w-full mt-3 p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-pink-200"
        rows={3}
      />

      {/* Image attach */}
      <div className="mt-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          <span className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
            Attach Image
          </span>
        </label>

        {imageDataUrl && (
          <div className="w-20 h-20 rounded-md overflow-hidden border">
            <img src={imageDataUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Save / Clear buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => { setSelectedMood(""); setJournal(""); setImageDataUrl(null); }}
          className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          disabled={!selectedMood && !journal && !imageDataUrl}
          className="px-4 py-2 rounded-md bg-pink-400 text-white hover:bg-pink-500 disabled:opacity-60"
        >
          Save Mood
        </button>
      </div>

      {/* Inline Mood Trend Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
            <AnalyticsPreview /> {/* Mood-only chart */}
          </div>
        </div>
      )}
    </div>
  );
}
