import React, { useState, useEffect } from "react";

const alerts = [
  { time: "10:14:32", msg: "Tab switch detected", level: "warning" },
  { time: "10:18:05", msg: "Second person detected", level: "danger" },
  { time: "10:22:47", msg: "Phone object detected", level: "danger" },
  { time: "10:25:10", msg: "Gaze deviation flagged", level: "warning" },
];

export default function DashboardPreview() {
  const [score, setScore] = useState(88);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.min(99, Math.max(70, s + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">Live Preview</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Real-Time <span className="text-blue-600">Monitoring Dashboard</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Proctors get a comprehensive live view of every candidate during the exam.
          </p>
        </div>

        <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          {/* Dashboard Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm">AI Proctor — Live Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Session Active
              </span>
              <span className="text-gray-500 text-xs ml-4">10:27:44</span>
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="grid md:grid-cols-3 gap-0 divide-x divide-gray-800">

            {/* Left — Candidate Info */}
            <div className="p-6 space-y-5">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Candidate</h3>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">A</div>
                <div>
                  <p className="text-white font-semibold text-sm">Alex Johnson</p>
                  <p className="text-gray-500 text-xs">ID: EX-2024-0891</p>
                </div>
              </div>

              {/* Info rows */}
              {[["Exam", "Advanced ML – CS501"], ["Duration", "90 min"], ["Started", "09:30 AM"], ["Status", "In Progress"]].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">{k}</span>
                  <span className={`text-xs font-medium ${k === "Status" ? "text-green-400" : "text-gray-200"}`}>{v}</span>
                </div>
              ))}

              {/* Exam Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-blue-400 font-medium">18 / 30</span>
                </div>
                <div className="bg-gray-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-[60%]" />
                </div>
              </div>
            </div>

            {/* Center — Webcam + AI Score */}
            <div className="p-6 space-y-4">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Live Feed</h3>

              {/* Webcam Box */}
              <div className="relative bg-gray-800 rounded-xl h-40 flex items-center justify-center overflow-hidden border border-gray-700">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-8 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <span className="text-blue-400 text-[9px] font-bold tracking-widest">FACE VERIFIED</span>
                </div>
                {/* Scan line animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse" />
                {/* Corner brackets */}
                {[["top-2 left-2", "border-t-2 border-l-2"], ["top-2 right-2", "border-t-2 border-r-2"], ["bottom-2 left-2", "border-b-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"]].map(([pos, border]) => (
                  <div key={pos} className={`absolute ${pos} w-4 h-4 border-blue-500 ${border}`} />
                ))}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-[8px] font-bold">REC</span>
                </span>
              </div>

              {/* AI Confidence Score */}
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-2">AI Confidence Score</p>
                <p className="text-4xl font-black text-blue-400 tabular-nums">{score}<span className="text-xl">%</span></p>
                <div className="mt-2 bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${score}%` }} />
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[["👁", "Eye", "Normal"], ["🎙", "Audio", "Clear"], ["🖥", "Screen", "Locked"]].map(([icon, label, val]) => (
                  <div key={label} className="bg-gray-800 rounded-lg p-2 text-center">
                    <div className="text-base">{icon}</div>
                    <div className="text-gray-400 text-[9px]">{label}</div>
                    <div className="text-green-400 text-[9px] font-bold">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Alerts */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Activity Alerts</h3>
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{alerts.length}</span>
              </div>

              <div className="space-y-2">
                {alerts.map(({ time, msg, level }) => (
                  <div key={time} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${level === "danger" ? "bg-red-950 border border-red-800" : "bg-yellow-950 border border-yellow-800"}`}>
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${level === "danger" ? "bg-red-500" : "bg-yellow-400"} animate-pulse`} />
                    <div>
                      <p className={`text-xs font-medium ${level === "danger" ? "text-red-300" : "text-yellow-300"}`}>{msg}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Integrity Score */}
              <div className="bg-gray-800 rounded-xl p-4 mt-auto">
                <p className="text-gray-400 text-xs mb-3">Overall Integrity Score</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-white">74<span className="text-sm text-gray-400">/100</span></span>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">Review</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full w-[74%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
