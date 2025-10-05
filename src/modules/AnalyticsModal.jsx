// src/modules/AnalyticsModal.jsx
import React from "react";
import AnalyticsPreview from "./AnalyticsPreview";

export default function AnalyticsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold"
        >
          X
        </button>
        <AnalyticsPreview />
      </div>
    </div>
  );
}
