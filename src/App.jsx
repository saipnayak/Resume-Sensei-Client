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

  const handleAnalyze = async () => {
  setError(null);
  setResult(null);

  if (!resumeText.trim()) {
    setError("Please paste your resume text before analyzing.");
    return;
  }

  setLoading(true);
  try {
    const response = await analyzeResume(resumeText);
    setResult(response.data);
  } catch (err) {
    console.error(err);
    const message =
      err?.response?.data?.message || err.message || "Request failed";
    setError(`Analysis failed: ${message}`);
  } finally {
    setLoading(false);
  }
};

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
                onChange={async (e) => {
                  setError(null);
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  if (file.type !== "application/pdf") {
                    setError("Only PDF files are supported for upload.");
                    return;
                  }
                  try {
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const content = await page.getTextContent();
                      const strs = content.items.map((item) => item.str || "");
                      text += strs.join(" ") + "\n\n";
                    }
                    setResumeText(text);
                  } catch (err) {
                    console.error(err);
                    setError("Failed to extract text from PDF.");
                  }
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
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
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
