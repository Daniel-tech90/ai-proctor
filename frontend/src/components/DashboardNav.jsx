import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "ASSESSMENTS", path: "/assessments" },
  { label: "COURSES", path: "/courses" },
  { label: "CODE#", path: "/code" },
  { label: "PRACTICE", path: "/practice" },
  { label: "LSRW", path: "/lsrw" },
  { label: "BLOGS", path: "/blogs" },
  { label: "DASHBOARD", path: "/dashboard" },
];

export default function DashboardNav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">AI <span className="text-blue-600">Proctor</span></span>
        </div>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* User + Logout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 mt-1 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 mt-1 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
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
          <button onClick={handleLogout} className="text-left px-4 py-2 text-xs font-semibold text-red-500 mt-2">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
