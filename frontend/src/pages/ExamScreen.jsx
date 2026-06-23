import React, { useState, useEffect, useCallback, useRef } from "react";

const API = "https://ai-proctor-23da.onrender.com";

// Wake up face service on load
fetch(`${API}/health`).catch(() => {});

function captureSnapshot(videoRef) {
  const canvas = document.createElement("canvas");
  canvas.width = 320; canvas.height = 240;
  canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 320, 240);
  return canvas.toDataURL("image/jpeg", 0.8);
}

// ─── Face Capture Step ────────────────────────────────────────────────────────
function FaceCaptureStep({ onVerified, onCancel }) {
  const videoRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const [status, setStatus] = useState("Starting camera...");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamReady(true);
        setStatus("📷 Look straight at the camera, then click Capture");
      })
      .catch(() => setStatus("❌ Camera access denied. Please allow camera."));
    return () => {
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = async () => {
    setVerifying(true);
    setError("");
    setStatus("Capturing photo...");
    try {
      const image = captureSnapshot(videoRef);
      fetch(`${API}/api/face/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image }),
      }).catch(() => {});
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      setStatus("✅ Verified!");
      setTimeout(onVerified, 1500);
    } catch (e) {
      setError(e.message);
      setStatus("📷 Look straight at the camera, then click Capture");
      setVerifying(false);
    }
  };

  return (
    <div className="overflow-y-auto flex-1 px-8 py-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h3 className="font-bold text-gray-900 text-base">Step 2 — Identity Verification</h3>
      </div>
      <p className="text-sm text-gray-500 mb-5 self-start">Look directly at the camera, then click Capture & Proceed.</p>
      <div className="flex justify-center w-full mb-4">
        <div className="relative rounded-2xl overflow-hidden bg-gray-900" style={{ width: 320, height: 240 }}>
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className={`absolute inset-x-0 bottom-0 text-center text-xs py-2 font-medium transition-colors ${
            status.includes("✅") ? "bg-green-600 text-white" : "bg-black/60 text-white"
          }`}>{status}</div>
          {status.includes("✅") && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="bg-green-500 rounded-full p-4 shadow-lg animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">{error}</div>}
      <div className="flex gap-3 w-full mt-2">
        <button onClick={onCancel} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition">← Back</button>
        <button disabled={!camReady || verifying} onClick={handleCapture}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
          {verifying ? "Processing..." : "📸 Take Photo & Start Exam →"}
        </button>
      </div>
    </div>
  );
}


// ─── Terms & Conditions Modal ─────────────────────────────────────────────────
function TermsModal({ exam, onAccept, onClose }) {
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(1); // 1 = terms, 2 = face verify

  const terms = [
    { icon: "🖥️", title: "Full-Screen Mode", desc: "The exam must be taken in full-screen. Exiting full-screen will be flagged and recorded." },
    { icon: "🚫", title: "No Tab Switching", desc: "Do not switch tabs or open any other application. Every switch is logged as a violation." },
    { icon: "✅", title: "Single Correct Answer", desc: "Each question has exactly one correct answer. Choose carefully before proceeding." },
    { icon: "⏱️", title: "Auto-Submit on Timeout", desc: "The exam will auto-submit when the timer reaches zero. No extensions will be granted." },
    { icon: "📵", title: "No Refresh or Navigation", desc: "Do not refresh, press back, or navigate away from the exam page during the test." },
    { icon: "🔒", title: "Activity Monitoring", desc: "All activity is monitored by AI proctoring. Suspicious behavior will be reported to the examiner." },
    { icon: "📶", title: "Stable Internet Required", desc: "Ensure a stable internet connection before starting. Disconnections may affect your submission." },
    { icon: "📋", title: "No Return After Submission", desc: "Once submitted, you cannot re-attempt or review the exam. Submissions are final." },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-blue-600 rounded-t-2xl px-8 py-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📝</div>
            <div>
              <h2 className="text-xl font-bold">{exam.title}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{exam.subject} &nbsp;·&nbsp; {exam.duration} min &nbsp;·&nbsp; {exam.totalMarks} marks &nbsp;·&nbsp; {exam.questions?.length} questions</p>
            </div>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {["Terms & Conditions", "Face Verification"].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  step === i + 1 ? "bg-white text-blue-600" : step > i + 1 ? "bg-green-400 text-white" : "bg-white/20 text-white/70"
                }`}>
                  <span>{step > i + 1 ? "✓" : i + 1}</span>
                  <span>{label}</span>
                </div>
                {i === 0 && <div className="flex-1 h-px bg-white/30" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1 — Terms */}
        {step === 1 && (
          <>
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                <h3 className="font-bold text-gray-900 text-base">Instructions & Terms of Conduct</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terms.map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-gray-700">I have read, understood, and agree to all the terms & conditions above.</span>
              </label>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition">Cancel</button>
                <button disabled={!checked} onClick={() => setStep(2)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
                  Next: Verify Identity →
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 2 — Face Capture */}
        {step === 2 && (
          <FaceCaptureStep onVerified={onAccept} onCancel={() => setStep(1)} />
        )}
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
  const camRef = useRef(null);
  const API = "https://ai-proctor-23da.onrender.com";

  // Start camera on exam mount, stop on submit
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 160, height: 120, facingMode: "user" } })
      .then((stream) => { if (camRef.current) camRef.current.srcObject = stream; })
      .catch(() => {});
    return () => {
      if (camRef.current?.srcObject)
        camRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, []);

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

  // Fullscreen already triggered before exam starts (after face verification)

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
    if (camRef.current?.srcObject)
      camRef.current.srcObject.getTracks().forEach((t) => t.stop());
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
  const username = JSON.parse(localStorage.getItem("user") || "{}").name || "Student";

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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col relative overflow-hidden">
      {/* Watermark username */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i} className="absolute text-gray-400 font-bold text-4xl rotate-[-30deg] whitespace-nowrap opacity-20"
            style={{ top: `${(i % 4) * 28 - 5}%`, left: `${Math.floor(i / 4) * 38 - 10}%` }}>
            {username}
          </p>
        ))}
      </div>
      {/* Header */}
      <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-200 z-10 relative">
        <div>
          <p className="font-bold text-sm">{exam.title}</p>
          <p className="text-gray-500 text-xs">{exam.subject}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Live camera feed */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 border-2 border-green-500" style={{ width: 80, height: 60 }}>
            <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Answered</p>
            <p className="font-bold text-green-400">{answered}/{total}</p>
          </div>
          {(tabSwitches + fullscreenExits) > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Violations</p>
              <p className="font-bold text-red-400">{tabSwitches + fullscreenExits}</p>
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
            <p className="text-gray-500 text-sm mb-2">Question {current + 1} of {total}</p>
            <div className="bg-gray-100 rounded-2xl p-6 mb-6">
              <p className="text-lg font-medium leading-relaxed">{q.text}</p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers({ ...answers, [current]: oi })}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition font-medium text-sm ${
                    answers[current] === oi
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-800 hover:border-blue-400"
                  }`}>
                  <span className="mr-3 font-bold text-gray-400 group-hover:text-blue-400">{["A", "B", "C", "D"][oi]}.</span>{opt}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
                className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-sm font-semibold transition text-gray-800">
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
        <div className="w-56 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">Questions</p>
          <div className="grid grid-cols-4 gap-2">
            {exam.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-10 h-10 rounded-lg text-xs font-bold transition ${
                  i === current ? "bg-blue-600 text-white" :
                  answers[i] !== undefined ? "bg-green-600 text-white" :
                  "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {[["bg-blue-600", "Current"], ["bg-green-600", "Answered"], ["bg-gray-700", "Not Answered"]].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${color}`} />
                <span className="text-xs text-gray-500">{label}</span>
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
