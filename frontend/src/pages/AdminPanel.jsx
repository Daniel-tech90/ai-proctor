import React, { useState, useEffect } from "react";

const API = "https://ai-proctor-23da.onrender.com";

function getToken() { return localStorage.getItem("adminToken"); }

// ─── Admin Login ─────────────────────────────────────────────────────────────
export function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.user.role !== "admin" && data.user.role !== "proctor")
        throw new Error("Access denied. Admin only.");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-gray-500 text-sm mt-1">Restricted Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required placeholder="Admin Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Create Exam Form ─────────────────────────────────────────────────────────
function CreateExamModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", subject: "", duration: "", totalMarks: "", scheduledAt: "" });
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], answer: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => setQuestions([...questions, { text: "", options: ["", "", "", ""], answer: 0 }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, val) => {
    const q = [...questions]; q[i][field] = val; setQuestions(q);
  };
  const updateOption = (qi, oi, val) => {
    const q = [...questions]; q[qi].options[oi] = val; setQuestions(q);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, duration: Number(form.duration), totalMarks: Number(form.totalMarks), questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onCreated(data);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex items-start justify-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Exam</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Exam Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (mins)</label>
              <input type="number" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Total Marks</label>
              <input type="number" required value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="col-span-2"><label className="text-xs font-medium text-gray-600 mb-1 block">Schedule Date & Time</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>

          {/* Questions */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 text-sm">Questions ({questions.length})</h4>
              <button type="button" onClick={addQuestion} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">+ Add Question</button>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-gray-50 rounded-xl p-4 relative">
                  <button type="button" onClick={() => removeQuestion(qi)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">✕</button>
                  <p className="text-xs font-medium text-gray-600 mb-2">Q{qi + 1}</p>
                  <input placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(qi, "text", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input type="radio" name={`answer-${qi}`} checked={q.answer === oi} onChange={() => updateQuestion(qi, "answer", oi)} />
                        <input placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" required />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">● = Correct answer</p>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-60">
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export function AdminDashboard({ user, onLogout }) {
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("exams");

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API}/api/sessions`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch { setSessions([]); }
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/exams`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch { setExams([]); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/auth/users`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { setUsers([]); }
  };

  useEffect(() => {
    fetchExams(); fetchUsers(); fetchSessions(); fetchCodes(); fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this exam?")) return;
    await fetch(`${API}/api/exams/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchExams();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    onLogout();
  };

  const tabs = ["exams", "schedule", "users", "violations", "codes", "live"];

  const [liveSessions, setLiveSessions] = useState([]);

  const fetchLiveSessions = async () => {
    try {
      const res = await fetch(`${API}/api/auth/active-sessions`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setLiveSessions(Array.isArray(data) ? data : []);
    } catch { setLiveSessions([]); }
  };

  const [codes, setCodes] = useState([]);
  const [codeForm, setCodeForm] = useState({ code: "", password: "", examId: "", maxUsers: 8 });
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const fetchCodes = async () => {
    try {
      const res = await fetch(`${API}/api/examcodes`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setCodes(Array.isArray(data) ? data : []);
    } catch { setCodes([]); }
  };

  const handleCreateCode = async (e) => {
    e.preventDefault(); setCodeError(""); setCodeSuccess(""); setCodeLoading(true);
    try {
      const res = await fetch(`${API}/api/examcodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...codeForm, maxUsers: Number(codeForm.maxUsers) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCodeSuccess(`✅ Code "${data.code}" created!`);
      setCodeForm({ code: "", password: "", examId: "", maxUsers: 8 });
      fetchCodes();
    } catch (err) { setCodeError(err.message); }
    finally { setCodeLoading(false); }
  };

  const handleDeleteCode = async (id) => {
    if (!window.confirm("Delete this code?")) return;
    await fetch(`${API}/api/examcodes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchCodes();
  };
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault(); setUserError(""); setUserSuccess(""); setUserLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserSuccess(`✅ User "${data.name}" created successfully!`);
      setUserForm({ name: "", email: "", password: "", role: "student" });
      fetchUsers();
    } catch (err) { setUserError(err.message); }
    finally { setUserLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`${API}/api/auth/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <span className="font-bold text-lg">Welcome Dinesh — Controller Panel</span>
          <span className="text-indigo-300 text-xs ml-2">AI Proctor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-indigo-200">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[["Total Exams", exams.length, "📝"], ["Scheduled", exams.filter(e => e.scheduledAt).length, "📅"], ["Active", exams.filter(e => e.isActive).length, "✅"]].map(([label, val, icon]) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{val}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition ${tab === t ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              {t === "exams" ? "All Exams" : t === "schedule" ? "Scheduled" : t === "users" ? "Login Activity" : t === "violations" ? "Violations" : t === "codes" ? "Exam Codes" : (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                  Live Sessions
                  {liveSessions.length > 0 && <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{liveSessions.length}</span>}
                </span>
              )}
            </button>
          ))}
          <button onClick={() => setShowCreate(true)} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
            + Create Exam
          </button>
        </div>

        {/* Exam List / Users */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {tab === "live" ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Student", "Email", "Role", "IP Address", "Device / Browser", "Logged In At"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {liveSessions.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No active sessions right now.</td></tr>
                ) : liveSessions.map((s, i) => {
                  const ua = s.userAgent || "";
                  const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : ua.includes("Edge") ? "Edge" : "Unknown";
                  const device = ua.includes("Mobile") ? "📱 Mobile" : "🖥️ Desktop";
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          s.role === "admin" ? "bg-red-50 text-red-600" : s.role === "proctor" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                        }`}>{s.role}</span>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{s.ip}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{device} · {browser}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.loginAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : tab === "codes" ? (
            <div>
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Create Exam Access Code</h3>
                <form onSubmit={handleCreateCode} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Access Code</label>
                    <input required value={codeForm.code} onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. BATCH2024" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
                    <input required value={codeForm.password} onChange={(e) => setCodeForm({ ...codeForm, password: e.target.value })}
                      placeholder="Shared password" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Exam</label>
                    <select required value={codeForm.examId} onChange={(e) => setCodeForm({ ...codeForm, examId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="">Select Exam</option>
                      {exams.map((ex) => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Max Users</label>
                    <input type="number" min="1" max="50" value={codeForm.maxUsers} onChange={(e) => setCodeForm({ ...codeForm, maxUsers: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <button type="submit" disabled={codeLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg disabled:opacity-60 transition">
                      {codeLoading ? "Creating..." : "+ Create Code"}
                    </button>
                    {codeSuccess && <span className="text-green-600 text-sm font-medium">{codeSuccess}</span>}
                    {codeError && <span className="text-red-600 text-sm">{codeError}</span>}
                  </div>
                </form>
                <p className="text-xs text-gray-400 mt-3">Share URL with students: <span className="font-mono font-semibold text-indigo-600">https://ai-dinesh.vercel.app/exam</span></p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Code", "Exam", "Active Logins", "Max Users", "Status", "Created", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {codes.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No exam codes yet</td></tr>
                  ) : codes.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{c.code}</td>
                      <td className="px-4 py-3 text-gray-700">{c.examId?.title || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          c.activeLogins >= c.maxUsers ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        }`}>{c.activeLogins} / {c.maxUsers}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.maxUsers}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${c.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteCode(c._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : tab === "violations" ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Student", "Email", "Exam", "Score", "Tab Switches", "Fullscreen Exits", "Submitted At"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No exam sessions found</td></tr>
                ) : sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.student?.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.student?.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{s.exam?.title || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{s.score ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        s.tabSwitches > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                      }`}>{s.tabSwitches || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        s.fullscreenExits > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      }`}>{s.fullscreenExits || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.endedAt ? new Date(s.endedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tab === "users" ? (
            <div>
              {/* Create User Form */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Create New User</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
                    <input required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                    <input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
                    <input type="text" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Set password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Role</label>
                    <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="student">Student</option>
                      <option value="proctor">Proctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <button type="submit" disabled={userLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg disabled:opacity-60 transition">
                      {userLoading ? "Creating..." : "+ Create User"}
                    </button>
                    {userSuccess && <span className="text-green-600 text-sm font-medium">{userSuccess}</span>}
                    {userError && <span className="text-red-600 text-sm">{userError}</span>}
                  </div>
                </form>
              </div>
              {/* Users Table */}
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Name", "Email", "Role", "Registered", "Last Login", "IP Address", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          u.role === "admin" ? "bg-red-50 text-red-600" :
                          u.role === "proctor" ? "bg-yellow-50 text-yellow-600" :
                          "bg-green-50 text-green-600"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {u.lastLoginAt ? (
                          <span className="text-xs text-indigo-600 font-medium">{new Date(u.lastLoginAt).toLocaleString()}</span>
                        ) : <span className="text-xs text-gray-400">Never</span>}
                      </td>
                      <td className="px-4 py-3">
                        {u.lastLoginIp ? (
                          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{u.lastLoginIp}</span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : exams.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No exams found. Create one!</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Title", "Subject", "Duration", "Marks", "Questions", "Scheduled", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(tab === "schedule" ? exams.filter(e => e.scheduledAt) : exams).map((exam) => (
                  <tr key={exam._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{exam.title}</td>
                    <td className="px-4 py-3 text-gray-600">{exam.subject}</td>
                    <td className="px-4 py-3 text-gray-600">{exam.duration} min</td>
                    <td className="px-4 py-3 text-gray-600">{exam.totalMarks}</td>
                    <td className="px-4 py-3 text-gray-600">{exam.questions?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {exam.scheduledAt ? (
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-lg">
                          {new Date(exam.scheduledAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(exam._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && <CreateExamModal onClose={() => setShowCreate(false)} onCreated={() => { fetchExams(); }} />}
    </div>
  );
}
