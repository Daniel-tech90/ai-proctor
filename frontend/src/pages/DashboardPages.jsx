import React from "react";
import EmptyState from "../components/EmptyState";

export function Assessments() {
  return <EmptyState title="No Categories Found" />;
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
  const handleLogout = () => {
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
