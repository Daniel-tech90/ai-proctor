import React, { useState, useEffect, useCallback } from "react";

// ─── Terms & Conditions Modal ─────────────────────────────────────────────────
function TermsModal({ exam, onAccept, onClose }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
          <p className="text-gray-500 text-sm mt-1">{exam.subject} · {exam.duration} min · {exam.totalMarks} marks</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-gray-600 space-y-2 max-h-48 overflow-y-auto">
          <p className="font-semibold text-gray-800">Terms & Conditions</p>
          <p>1. The exam will run in <strong>full-screen mode</strong>. Exiting full-screen will be flagged.</p>
          <p>2. Do <strong>not</strong> switch tabs or open other applications during the exam.</p>
          <p>3. Each question has only <strong>one correct answer</strong>.</p>
          <p>4. You cannot go back once you submit the exam.</p>
          <p>5. The exam will <strong>auto-submit</strong> when the timer reaches zero.</p>
          <p>6. Any suspicious activity will be <strong>recorded and reported</strong>.</p>
          <p>7. Ensure stable internet connection before starting.</p>
          <p>8. Do not refresh the page during the exam.</p>
        </div>

        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <span className="text-sm text-gray-700">I have read and agree to the terms & conditions</span>
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition"
        >
          Proceed to Exam →
        </button>
      </div>
    </div>
  );
}

// ─── Exam Screen ──────────────────────────────────────────────────────────────
export default function ExamScreen({ exam, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const token = localStorage.getItem("token");
  const API = "https://ai-proctor-23da.onrender.com";

  // Start session on mount
  useEffect(() => {
    const start = async () => {
      try {
        const res = await fetch(`${API}/api/sessions/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ examId: exam._id }),
        });
        const data = await res.json();
        setSessionId(data._id);
      } catch {}
    };
    start();
  }, []);

  // Fullscreen
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    return () => { if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen(); };
  }, []);

  // Detect fullscreen exit
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && !submitted) {
        setFullscreenExits((v) => v + 1);
        alert("⚠️ Warning: You exited full-screen! This has been recorded.");
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [submitted]);

  // Detect tab switch
  useEffect(() => {
    const handler = () => {
      if (document.hidden && !submitted) {
        setTabSwitches((v) => v + 1);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [submitted]);

  // Timer
  const handleSubmit = useCallback(async () => {
    let correct = 0;
    exam.questions.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    setScore(correct);
    setSubmitted(true);
    if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
    // Save to backend
    if (sessionId) {
      try {
        await fetch(`${API}/api/sessions/${sessionId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            answers: Object.entries(answers).map(([qi, opt]) => ({ questionIndex: Number(qi), selectedOption: opt })),
            tabSwitches,
            fullscreenExits,
          }),
        });
      } catch {}
    }
  }, [answers, exam.questions, sessionId, tabSwitches, fullscreenExits, token]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, handleSubmit]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const q = exam.questions[current];
  const total = exam.questions.length;
  const answered = Object.keys(answers).length;

  // ─── Result Screen ────────────────────────────────────────────────────────
  if (submitted) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${pct >= 50 ? "bg-green-100" : "bg-red-100"}`}>
            <span className="text-3xl">{pct >= 50 ? "🎉" : "😔"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Exam Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">{exam.title}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[["Score", `${score}/${total}`], ["Accuracy", `${Math.round((score / total) * 100)}%`], ["Tab Switches", tabSwitches], ["Fullscreen Exits", fullscreenExits]].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg font-bold text-blue-600">{val}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
          <button onClick={onFinish} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition">
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  // ─── Exam UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div>
          <p className="font-bold text-sm">{exam.title}</p>
          <p className="text-gray-400 text-xs">{exam.subject}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400">Answered</p>
            <p className="font-bold text-green-400">{answered}/{total}</p>
          </div>
          {violations > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-400">Violations</p>
              <p className="font-bold text-red-400">{violations}</p>
            </div>
          )}
          <div className={`text-center px-4 py-2 rounded-xl ${timeLeft < 60 ? "bg-red-600 animate-pulse" : "bg-blue-600"}`}>
            <p className="text-xs text-white/70">Time Left</p>
            <p className="font-bold text-lg">{mins}:{secs}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            <p className="text-gray-400 text-sm mb-2">Question {current + 1} of {total}</p>
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <p className="text-lg font-medium leading-relaxed">{q.text}</p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers({ ...answers, [current]: oi })}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition font-medium text-sm ${
                    answers[current] === oi
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-gray-700 bg-gray-800 text-gray-200 hover:border-blue-400"
                  }`}>
                  <span className="mr-3 font-bold text-gray-400">{["A", "B", "C", "D"][oi]}.</span>{opt}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
                className="px-6 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-sm font-semibold transition">
                ← Previous
              </button>
              {current < total - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold transition">
                  Next →
                </button>
              ) : (
                <button onClick={() => { if (window.confirm("Submit exam now?")) handleSubmit(); }}
                  className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-sm font-semibold transition">
                  Submit Exam ✓
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="w-56 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">Questions</p>
          <div className="grid grid-cols-4 gap-2">
            {exam.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-10 h-10 rounded-lg text-xs font-bold transition ${
                  i === current ? "bg-blue-600 text-white" :
                  answers[i] !== undefined ? "bg-green-600 text-white" :
                  "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {[["bg-blue-600", "Current"], ["bg-green-600", "Answered"], ["bg-gray-700", "Not Answered"]].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${color}`} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { if (window.confirm("Submit exam now?")) handleSubmit(); }}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2.5 rounded-xl transition">
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}

export { TermsModal };
