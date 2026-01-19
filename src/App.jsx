import React, { useState } from "react";
import Loader from "./components/Loader";
import ResultSection from "./components/ResultSection";

import { analyzeResume } from "./services/ResumeService";

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [view, setView] = useState("INPUT");

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!resumeText && !file) {
      setError("Please paste resume text or upload a PDF.");
      return;
    }

    setView("ANALYZING");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeResume(resumeText, file);
      setResult(response.data);
      setView("RESULT");
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
      setView("INPUT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {view === "INPUT" && (
        <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-sky-50 font-sans"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
          }}
        >
          <div className="w-full max-w-5xl mx-auto p-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="md:flex">
                {/* Left column */}
                <div className="md:w-2/5 p-8 bg-gradient-to-b from-white to-slate-50">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                        RS
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                          Resume Sensei
                        </h1>
                        <p className="text-sm text-gray-500">
                          AI-powered resume analysis
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Upload your resume PDF or paste the text to get instant
                    feedback, strengths, improvements, and interview questions.
                  </p>

                  <label className="block text-sm text-gray-600 mb-2">
                    Upload PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      setError(null);
                      const selectedFile = e.target.files?.[0];
                      if (!selectedFile) return;
                      if (selectedFile.type !== "application/pdf") {
                        setError("Only PDF files are supported.");
                        return;
                      }
                      setFile(selectedFile);
                    }}
                    className="block w-full text-sm text-gray-700 mb-4"
                  />

                  <label className="block text-sm text-gray-600 mb-2">
                    Or paste resume text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume here..."
                    className="w-full min-h-[140px] p-3 border border-gray-200 rounded-md text-sm mb-4"
                  />

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-60"
                    >
                      Analyze Resume
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {!error && (
                      <p className="text-sm text-gray-500">
                        Analysis may take up to 60 seconds
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column (placeholder) */}
                <div className="md:w-3/5 p-8 flex items-center justify-center text-gray-400 text-sm">
                  No analysis yet — submit your resume to begin.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "ANALYZING" && (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader />
          <p className="mt-4 text-gray-600 text-sm">
            Analyzing your resume. This may take up to 60 seconds.
          </p>
        </div>
      )}

      {view === "RESULT" && result && (
        <div className="grid grid-cols-1 gap-6 ">
          <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <div className="p-y mb-8  flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 text-xl rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  RS
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Resume Analysis Report
                  </h1>
                  <p className="text-sm opacity-90">
                    AI-powered insights to improve your resume and interview
                    readiness
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                    ✨ AI-Generated
                  </span>
                </div>

                <button
                  onClick={() => {
                    setResumeText("");
                    setFile(null);
                    setResult(null);
                    setError(null);
                    setView("INPUT");
                  }}
                  className="bg-indigo-600 mt-2 px-4 py-2 rounded-md text-sm text-white hover:bg-indigo-800"
                >
                  + New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <ResultSection title="Resume Score">
                {(() => {
                  const score = result.score;

                  const color =
                    score >= 80 ? "green" : score >= 60 ? "indigo" : "amber";

                  const colorMap = {
                    green: {
                      text: "text-green-600",
                      ring: "border-green-200",
                      bg: "bg-green-50",
                    },
                    indigo: {
                      text: "text-orange-600",
                      ring: "border-orange-200",
                      bg: "bg-orange-50",
                    },
                    amber: {
                      text: "text-red-600",
                      ring: "border-red-200",
                      bg: "bg-red-50",
                    },
                  };

                  const theme = colorMap[color];

                  return (
                    <div className="flex items-center justify-between rounded-2xl p-6 border bg-white shadow-sm animate-[fadeInUp_0.5s_ease-out]">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Overall Resume Score
                        </p>
                        <p className={`text-4xl font-semibold ${theme.text}`}>
                          {score}/100
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {score >= 80
                            ? "Strong resume"
                            : score >= 60
                            ? "Good, but improvable"
                            : "Needs improvement"}
                        </p>
                      </div>

                      <div
                        className={`relative w-24 h-24 rounded-full border-8 ${theme.ring} flex items-center justify-center`}
                      >
                        <div
                          className={`absolute inset-0 rounded-full ${theme.bg} opacity-40 animate-pulse`}
                        />
                        <span
                          className={`relative text-xl font-semibold ${theme.text}`}
                        >
                          {score}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </ResultSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultSection title="Strengths">
                  <ul className="list-disc pl-5">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="mb-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                </ResultSection>

                <ResultSection title="Improvements">
                  <ul className="list-disc pl-5">
                    {result.improvements.map((s, i) => (
                      <li key={i} className="mb-1">{s}</li>
                    ))}
                  </ul>
                </ResultSection>
              </div>

              <ResultSection title="Interview Questions">
                <div className="space-y-3">
                  {result.interviewQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-3 hover:bg-slate-50 transition"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        Q{i + 1}. {q}
                      </p>
                    </div>
                  ))}
                </div>
              </ResultSection>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mb-2 ">
        Generated with ❤️ by Sai P Nayak
      </p>
    </>
  );
}
