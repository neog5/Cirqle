"use client";

import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    const url = new URL("/api/match-resume", process.env.NEXT_PUBLIC_SITE_URL);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setResult(data.result);
    } else {
      setError(data.error || "An error occurred while matching the resume.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-emerald-200 rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Resume Matcher
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Upload Resume{" "}
            <span className="text-gray-700" aria-hidden="true">
              (PDF/DOCX)
            </span>
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="block w-full border border-green-200 focus:border-green-600 rounded-lg bg-green-50 text-gray-900 px-3 py-2 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:font-semibold hover:file:bg-green-600"
          />
        </div>
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the job description here..."
            required
            className="w-full border border-green-200 focus:border-green-600 rounded-lg bg-green-50 text-gray-900 px-3 py-2 transition outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transition-all duration-200 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Matching..." : "Match Resume"}
        </button>
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-600 rounded-lg px-4 py-2 mt-2 text-center">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-green-700 mb-2">
              Matching Score
            </h3>
            <p className="text-4xl font-extrabold text-green-600">{result}</p>
          </div>
        )}
      </form>
    </div>
  );
}
