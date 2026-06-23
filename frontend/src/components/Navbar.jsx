import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const landingLinks = ["Home", "Features", "How It Works", "Dashboard", "Research", "Contact"];
const dashboardLinks = [
  { label: "ASSESSMENTS", path: "/assessments" },
  { label: "COURSES", path: "/courses" },
  { label: "CODE#", path: "/code" },
  { label: "PRACTICE", path: "/practice" },
  { label: "LSRW", path: "/lsrw" },
  { label: "BLOGS", path: "/blogs" },
  { label: "DASHBOARD", path: "/dashboard" },
];

export default function Navbar({ onLogin, onLogout, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login", openLogin);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-login", openLogin);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://ai-proctor-23da.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setShowLogin(false);
      setForm({ email: "", password: "" });
      if (onLogin) onLogin(data.user);
      navigate("/assessments");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? "/assessments" : "/")}>
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">AI <span className="text-blue-600">Proctor</span></span>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 flex-1 ml-8">
            {user ? (
              dashboardLinks.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                        active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })
            ) : (
              landingLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-2 text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))
            )}
          </ul>

          {/* Right — Login / User */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="btn-primary text-sm px-5 py-2.5">Login</button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 mt-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 mt-1 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2">
            {user ? (
              <>
                {dashboardLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`text-left px-4 py-2 text-xs font-semibold rounded-lg ${
                      location.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button onClick={handleLogout} className="text-left px-4 py-2 text-xs font-semibold text-red-500 mt-2">Logout</button>
              </>
            ) : (
              <>
                {landingLinks.map((link) => (
                  <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-gray-700 font-medium hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>
                    {link}
                  </a>
                ))}
                <button onClick={() => { setShowLogin(true); setMenuOpen(false); }} className="btn-primary text-sm mt-2">Login</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => { setShowLogin(false); setError(""); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to start your exam</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
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
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
