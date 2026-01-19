import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

import React, { useState } from "react";
import Loader from "./components/Loader";
import ResultSection from "./components/ResultSection";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import { analyzeResume } from "./services/ResumeService";



export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

  const handleAnalyze = async () => {
    if (!resumeText && !file) {
      setError("Please paste resume text or upload a PDF");
      return;
    }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await analyzeResume(resumeText, file);
    setResult(response.data);
  } catch (err) {
    setError(err.response?.data?.message || "Analysis failed");
  } finally {
    setLoading(false);
  }
}};

  return (
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
                Upload your resume PDF or paste the extracted text and get an
                instant score, strengths, improvements, and interview questions.
              </p>

              <label
                htmlFor="file"
                className="block text-sm text-gray-600 mb-2"
              >
                Upload PDF
              </label>
              <input
                id="file"
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

              <label
                htmlFor="resume"
                className="block text-sm text-gray-600 mb-2"
              >
                Or paste resume text
              </label>
              <textarea
                id="resume"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here..."
                className="w-full min-h-[140px] p-3 border border-gray-200 rounded-md text-sm mb-4"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-60"
                >
                </button>
                <div className="mt-6">
                   {loading && <Loader />}
                   {error && (
                    <p className="text-red-500 mt-4">{error}</p>
                    )}
                    </div>
                

                 {error && (
                   <p className="text-red-500 mt-4">{error}</p>
                   )}
                   {result && (
                    <ResultSection result={result} />
                    )}
                <span className="text-sm text-gray-500">
                  {error ? <span className="text-red-600">{error}</span> : ""}
                </span>
              </div>
            </div>

            {/* Right column */}
            <div className="md:w-3/5 p-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Analysis
                </h2>
                <div className="text-sm text-gray-500">
                  Results from the AI analyzer
                </div>
              </div>

              {result ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <ResultSection title="Resume Score">
                      <div className="text-4xl text-indigo-600 font-bold">
                        {result.score}
                      </div>
                    </ResultSection>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultSection title="Strengths">
                      <ul className="list-disc pl-5">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="py-1">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </ResultSection>

                    <ResultSection title="Improvements">
                      <ul className="list-disc pl-5">
                        {result.improvements.map((s, i) => (
                          <li key={i} className="py-1">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </ResultSection>
                  </div>

                  <ResultSection title="Interview Questions">
                    <ul className="list-disc pl-5">
                      {result.interviewQuestions.map((q, i) => (
                        <li key={i} className="py-1">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </ResultSection>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-gray-200 p-6 text-center text-gray-500">
                  No analysis yet — upload a PDF or paste resume text and click{" "}
                  <strong>Analyze Resume</strong>.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
