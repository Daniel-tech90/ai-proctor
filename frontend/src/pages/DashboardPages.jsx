import React, { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ExamScreen, { TermsModal } from "./ExamScreen";

const API = "https://ai-proctor-23da.onrender.com";

export function Assessments() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [inExam, setInExam] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API}/api/exams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setExams(Array.isArray(data) ? data : []);
      } catch { setExams([]); }
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  if (inExam && selectedExam) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900">
        <ExamScreen exam={selectedExam} onFinish={() => { setInExam(false); setSelectedExam(null); }} />
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>;
  if (exams.length === 0) return <EmptyState title="No Categories Found" />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam._id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full opacity-60" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{exam.subject}</span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{exam.duration} min</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">{exam.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Total Marks: <span className="font-medium text-gray-700">{exam.totalMarks}</span></p>
            <p className="text-sm text-gray-500 mb-4">Questions: <span className="font-medium text-gray-700">{exam.questions?.length || 0}</span></p>
            {exam.scheduledAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-green-700 font-medium">📅 {new Date(exam.scheduledAt).toLocaleString()}</p>
              </div>
            )}
            <button
              onClick={() => { setSelectedExam(exam); setShowTerms(true); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              Start Exam
            </button>
          </div>
        ))}
      </div>

      {showTerms && selectedExam && (
        <TermsModal
          exam={selectedExam}
          onClose={() => { setShowTerms(false); setSelectedExam(null); }}
          onAccept={() => {
            setShowTerms(false);
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
            setInExam(true);
          }}
        />
      )}
    </div>
  );
}

export function Courses() {
  return <EmptyState title="No Courses Found" subtitle="No courses are available at the moment." />;
}

const LANGUAGES = [
  { id: 71, label: "Python",     default: `print("Hello, World!")` },
  { id: 62, label: "Java",       default: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}` },
  { id: 54, label: "C++",        default: `#include<iostream>\nusing namespace std;\nint main(){\n  cout<<"Hello, World!";\n  return 0;\n}` },
  { id: 50, label: "C",          default: `#include<stdio.h>\nint main(){\n  printf("Hello, World!");\n  return 0;\n}` },
  { id: 63, label: "JavaScript", default: `console.log("Hello, World!");` },
];

// Judge0 via RapidAPI — replace with your key from https://rapidapi.com/judge0-official/api/judge0-ce
const JUDGE0_KEY = "<YOUR_RAPIDAPI_KEY>";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";

export function Code() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].default);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const handleLangChange = (id) => {
    const l = LANGUAGES.find((x) => x.id === Number(id));
    setLang(l); setCode(l.default); setOutput(null); setError("");
  };

  const runCode = async () => {
    setRunning(true); setOutput(null); setError("");
    try {
      // Submit
      const sub = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": JUDGE0_KEY,
          "X-RapidAPI-Host": JUDGE0_HOST,
        },
        body: JSON.stringify({
          language_id: lang.id,
          source_code: btoa(unescape(encodeURIComponent(code))),
          stdin: btoa(unescape(encodeURIComponent(stdin))),
        }),
      });
      const { token } = await sub.json();
      // Poll until done
      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 1200));
        const poll = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`, {
          headers: { "X-RapidAPI-Key": JUDGE0_KEY, "X-RapidAPI-Host": JUDGE0_HOST },
        });
        result = await poll.json();
        if (result.status?.id > 2) break;
      }
      const decode = (b64) => b64 ? decodeURIComponent(escape(atob(b64))) : "";
      if (result.stdout)       setOutput({ type: "success", text: decode(result.stdout) });
      else if (result.stderr)  setOutput({ type: "error",   text: decode(result.stderr) });
      else if (result.compile_output) setOutput({ type: "error", text: decode(result.compile_output) });
      else setOutput({ type: "info", text: result.status?.description || "No output" });
    } catch (e) {
      setError("Failed to run code. Check your API key or network.");
    }
    setRunning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Code# Compiler</h2>
        <div className="flex items-center gap-3">
          <select value={lang.id} onChange={(e) => handleLangChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
            {running
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Running...</>
              : <>▶ Run Code</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
            <span className="text-xs font-semibold text-gray-400">{lang.label}</span>
            <button onClick={() => setCode(lang.default)} className="text-xs text-gray-500 hover:text-gray-300 transition">Reset</button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full bg-[#1e1e1e] text-green-300 font-mono text-sm p-4 resize-none focus:outline-none"
            style={{ minHeight: "420px", tabSize: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Tab") { e.preventDefault(); const s = e.target.selectionStart; setCode(code.substring(0, s) + "  " + code.substring(e.target.selectionEnd)); setTimeout(() => e.target.setSelectionRange(s + 2, s + 2), 0); }
            }}
          />
        </div>

        {/* Input + Output */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-500">STDIN (Input)</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input here..."
              className="w-full font-mono text-sm p-4 resize-none focus:outline-none text-gray-700"
              style={{ minHeight: "120px" }}
            />
          </div>

          <div className="flex-1 bg-[#1e1e1e] rounded-2xl border border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
              <span className="text-xs font-semibold text-gray-400">OUTPUT</span>
            </div>
            <div className="p-4 font-mono text-sm" style={{ minHeight: "280px" }}>
              {running && <p className="text-yellow-400 animate-pulse">⏳ Executing...</p>}
              {error && <p className="text-red-400">{error}</p>}
              {output && (
                <pre className={`whitespace-pre-wrap ${
                  output.type === "success" ? "text-green-300" :
                  output.type === "error"   ? "text-red-400"   : "text-gray-400"
                }`}>{output.text}</pre>
              )}
              {!running && !output && !error && (
                <p className="text-gray-600">Output will appear here after running...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Practice() {
  return <EmptyState title="No Practice Sets Found" subtitle="No practice sets are available at the moment." />;
}

export function LSRW() {
  return <EmptyState title="No LSRW Content Found" subtitle="No LSRW content is available at the moment." />;
}

export function Blogs() {
  return <EmptyState title="No Blogs Found" subtitle="No blog posts are available at the moment." />;
}

export function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/sessions/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, []);

  // Compute stats from sessions
  const totalExams = sessions.length;
  const totalScore = sessions.reduce((s, x) => s + (x.score || 0), 0);
  const totalQuestions = sessions.reduce((s, x) => s + (x.exam?.questions?.length || 0), 0);
  const overallPct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  // Per-subject accuracy
  const subjectMap = {};
  sessions.forEach((s) => {
    const subj = s.exam?.subject || "Unknown";
    if (!subjectMap[subj]) subjectMap[subj] = { score: 0, total: 0 };
    subjectMap[subj].score += s.score || 0;
    subjectMap[subj].total += s.exam?.questions?.length || 0;
  });
  const subjectStats = Object.entries(subjectMap).map(([subj, { score, total }]) => ({
    subj, score, total, pct: total > 0 ? Math.round((score / total) * 100) : 0,
  }));

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const barColor = (pct) => pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* User Info */}
        <div className="md:col-span-2 bg-[#1a3a6b] rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome {user.name?.toUpperCase()}</h2>
              <p className="text-blue-200 text-sm mb-4">Email: {user.email}</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Reported Issues</button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Change Password</button>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Logout</button>
              </div>
            </div>
            <div className="text-sm text-blue-100 space-y-2">
              <p>Batch: Technical Batch 02 - 2027</p>
              <p>ID No: {user.email?.split("@")[0]}</p>
            </div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-[#1a3a6b] rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">Overall Accuracy</h3>
          {loadingSessions ? (
            <p className="text-blue-200 text-sm">Loading...</p>
          ) : (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-200">{totalScore}/{totalQuestions} correct</span>
                <span className="font-bold text-2xl">{overallPct}%</span>
              </div>
              <div className="w-full bg-blue-900 rounded-full h-4 mb-3">
                <div className={`h-4 rounded-full transition-all duration-700 ${barColor(overallPct)}`} style={{ width: `${overallPct}%` }} />
              </div>
              <p className="text-blue-200 text-xs">{totalExams} exam{totalExams !== 1 ? "s" : ""} completed</p>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Exams Taken",    val: totalExams,                       color: "text-blue-600",  bg: "bg-blue-50" },
          { label: "Total Score",    val: `${totalScore}/${totalQuestions}`, color: "text-green-600", bg: "bg-green-50" },
          { label: "Overall %",      val: `${overallPct}%`,                 color: overallPct >= 50 ? "text-green-600" : "text-red-500", bg: overallPct >= 50 ? "bg-green-50" : "bg-red-50" },
          { label: "Best Score",     val: sessions.length > 0 ? `${Math.max(...sessions.map((s) => s.exam?.questions?.length > 0 ? Math.round((s.score / s.exam.questions.length) * 100) : 0))}%` : "—", color: "text-purple-600", bg: "bg-purple-50" },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 border border-gray-100`}>
            <p className={`text-2xl font-bold ${color}`}>{loadingSessions ? "..." : val}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Subject-wise Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-base mb-4">Subject-wise Accuracy</h3>
          {loadingSessions ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : subjectStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No exam data yet.</p>
          ) : (
            <div className="space-y-4">
              {subjectStats.map(({ subj, score, total, pct }) => (
                <div key={subj}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{subj}</span>
                    <span className={`font-bold ${pct >= 75 ? "text-green-600" : pct >= 50 ? "text-yellow-500" : "text-red-500"}`}>{pct}% ({score}/{total})</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all duration-700 ${barColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Exams */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-base mb-4">Recent Exams</h3>
          {loadingSessions ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">No exams taken yet.</p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((s) => {
                const total = s.exam?.questions?.length || 0;
                const pct = total > 0 ? Math.round((s.score / total) * 100) : 0;
                return (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.exam?.title || "Exam"}</p>
                      <p className="text-xs text-gray-400">{s.exam?.subject} · {new Date(s.endedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${pct >= 50 ? "text-green-600" : "text-red-500"}`}>{pct}%</p>
                      <p className="text-xs text-gray-400">{s.score}/{total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
