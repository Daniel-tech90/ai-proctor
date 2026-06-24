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

export function Code() {
  return <EmptyState title="No Challenges Found" subtitle="No coding challenges are available at the moment." />;
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
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("https://ai-proctor-23da.onrender.com/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* User Info Card */}
        <div className="md:col-span-2 bg-[#1a3a6b] rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome {user.name?.toUpperCase()}</h2>
              <p className="text-blue-200 text-sm mb-4">Email: {user.email}</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Reported Issues</button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">Change Password</button>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">logout</button>
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
          <h3 className="text-lg font-semibold mb-4">Your Overall Accuracy</h3>
          <div className="flex justify-between text-sm mb-2">
            <span></span>
            <span className="font-bold">0%</span>
          </div>
          <div className="w-full bg-blue-500 rounded-full h-3">
            <div className="bg-white h-3 rounded-full" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { title: "Assessment Activity", stats: [["Completed", "9/18"], ["Yet to Start", "9/18"]], link: "View Recent Assessments" },
          { title: "Course Activity", stats: [["InProgress", "0/0"], ["Yet to Start", "0/0"]], link: "View Recent Courses" },
          { title: "Practice Activity", stats: [["Completed", "0/0"], ["Yet to Start", "0/0"]], link: "View Recent Practice" },
        ].map(({ title, stats, link }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-50 rounded-tl-full opacity-60" />
            <h3 className="font-bold text-gray-900 text-base mb-3">{title}</h3>
            {stats.map(([label, val]) => (
              <p key={label} className="text-gray-600 text-sm mb-1">{label}: <span className="font-medium">{val}</span></p>
            ))}
            <button className="text-blue-600 text-sm font-semibold mt-3 hover:underline">{link}</button>
          </div>
        ))}
      </div>

      {/* Accuracy Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["MCQ: Subject Level Accuracy", "Coding: Programming wise Accuracy"].map((title) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[200px] relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-tl-full opacity-40" />
            <h3 className="font-bold text-gray-900 text-base mb-4">{title}</h3>
            <div className="flex items-center justify-center h-28 text-gray-400 text-sm">No data available</div>
          </div>
        ))}
      </div>
    </div>
  );
}
