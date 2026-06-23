import React, { useEffect, useState } from "react";

const typingWords = ["Start your preparation Courses", "Start your preparation Journey"];
const LONGEST_WORD = typingWords.reduce((a, b) => (a.length > b.length ? a : b), "");

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const word = typingWords[wordIndex] || "";
    let timeout;
    if (typing) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setWordIndex((i) => (i + 1) % typingWords.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIndex]);

  return (
    <section id="home" className="min-h-screen pt-24 pb-16 flex items-center bg-gradient-to-br from-white via-blue-50/30 to-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

        {/* Left Content — fixed width, no reflow */}
        <div style={{ width: "100%", minWidth: 0 }}>
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI-Powered Proctoring Platform
          </span>

          {/* Heading with fully reserved fixed height */}
          <div style={{ height: "140px", overflow: "hidden" }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Welcome,</span>
              {/* Ghost text reserves space, visible text overlays it */}
              <span className="relative block text-3xl md:text-4xl" style={{ height: "52px" }}>
                {/* Invisible ghost to hold max width */}
                <span className="invisible block whitespace-nowrap text-blue-600 text-3xl md:text-4xl font-extrabold" aria-hidden="true">
                  {LONGEST_WORD}|
                </span>
                {/* Actual animated text absolutely positioned */}
                <span className="absolute top-0 left-0 text-blue-600 whitespace-nowrap font-extrabold tracking-tight drop-shadow-sm">
                  {displayed}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </h1>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
            A next-generation{" "}
            <span className="text-blue-600 font-medium">AI-driven</span> examination platform that enables secure online testing through{" "}
            <span className="text-blue-600 font-medium">real-time monitoring</span>, automated suspicious activity detection, and accurate performance evaluation.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="btn-primary flex items-center gap-2" onClick={() => window.dispatchEvent(new Event('open-login'))}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Exam
            </button>
            <button className="btn-outline flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100">
            {[["10K+", "Exams Conducted"], ["99.2%", "Detection Accuracy"], ["500+", "Institutions"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-blue-600">{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Floating Illustration, fully fixed position */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignSelf: "start", marginTop: "2rem" }}>
          <img
            src={require("../examimage.png")}
            alt="Exam Preview"
            className="w-full max-w-md object-contain"
            style={{ background: "none", boxShadow: "none", border: "none" }}
          />
        </div>
      </div>
    </section>
  );
}
