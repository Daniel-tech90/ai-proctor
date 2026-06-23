import React, { useState } from "react";
import { FaceRegister, FaceVerify } from "./FaceVerify";

const API = "https://ai-proctor-23da.onrender.com";

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // face flow state
  const [tempToken, setTempToken] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [showFaceRegister, setShowFaceRegister] = useState(false);
  const [showFaceVerify, setShowFaceVerify] = useState(false);
  const [hasFace, setHasFace] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      setTempToken(data.token);
      setTempUser(data.user);

      if (tab === "register") {
        // After register → prompt face registration
        setShowFaceRegister(true);
      } else {
        // After login → if face registered, verify; else go straight in
        if (data.user.hasFace) {
          setHasFace(true);
          setShowFaceVerify(true);
        } else {
          finishLogin(data.token, data.user);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);
  };

  const handleFaceRegisterDone = () => {
    setShowFaceRegister(false);
    finishLogin(tempToken, tempUser);
  };

  const handleFaceVerifySuccess = () => {
    setShowFaceVerify(false);
    finishLogin(tempToken, tempUser);
  };

  const handleFaceVerifyCancel = async () => {
    // logout the session since face failed
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    setShowFaceVerify(false);
    setTempToken(null);
    setTempUser(null);
    setError("Face verification cancelled. Login aborted.");
  };

  return (
    <>
      {showFaceRegister && (
        <FaceRegister token={tempToken} onDone={handleFaceRegisterDone} />
      )}
      {showFaceVerify && (
        <FaceVerify token={tempToken} onSuccess={handleFaceVerifySuccess} onCancel={handleFaceVerifyCancel} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white px-4">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">{tab === "login" ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-gray-500 mt-1 text-sm">{tab === "login" ? "Sign in to start your exam" : "Register to get started"}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {["login", "register"].map((t) => (
                <button key={t} onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${tab === t ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" required placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" required placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
              </div>

              {tab === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition">
                    <option value="student">Student</option>
                    <option value="proctor">Proctor</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-60">
                {loading ? (tab === "login" ? "Signing in..." : "Registering...") : (tab === "login" ? "Sign In" : "Register")}
              </button>
            </form>

            {tab === "login" && (
              <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                <span>🔒</span> Face verification required if enabled on your account
              </p>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">AI Proctor — Secure Examination Platform</p>
        </div>
      </div>
    </>
  );
}
