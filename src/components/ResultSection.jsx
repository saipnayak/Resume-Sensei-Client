import React from "react";

export default function ResultSection({ title, children }) {
  return (
    <section className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="text-sm text-gray-800">{children}</div>
    </section>
  );
}
