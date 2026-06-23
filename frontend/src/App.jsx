import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import DashboardPreview from "./components/DashboardPreview";
import Footer from "./components/Footer";
import { Assessments, Courses, Code, Practice, LSRW, Blogs, Dashboard } from "./pages/DashboardPages";
import { AdminLogin, AdminDashboard } from "./pages/AdminPanel";

function LandingPage({ user, onLogin, onLogout }) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Footer />
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-200 z-50">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}

function DashboardLayout({ user, onLogin, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="pt-20">{children}</main>
    </div>
  );
}

function AdminRoute() {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("adminUser");
    return saved ? JSON.parse(saved) : null;
  });
  if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;
  return <AdminDashboard user={adminUser} onLogout={() => setAdminUser(null)} />;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
        <Route path="/assessments" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Assessments /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/courses" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Courses /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/code" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Code /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/practice" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Practice /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/lsrw" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><LSRW /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/blogs" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Blogs /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/dashboard" element={
          user ? <DashboardLayout user={user} onLogin={handleLogin} onLogout={handleLogout}><Dashboard /></DashboardLayout> : <Navigate to="/" replace />
        } />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
