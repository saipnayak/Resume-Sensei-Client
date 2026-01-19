import React from "react";
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      <p className="text-gray-700 font-medium">
        Analyzing your resume…
      </p>

      <p className="text-xs text-gray-400">
        Processing resume • Generating insights • Finalizing results
      </p>

    </div>
  );
}
