import React from "react";
import EmptyState from "../components/EmptyState";

export function Assessments() {
  return <EmptyState title="No Categories Found" subtitle="No assessment categories are available at the moment." />;
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
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-500 text-sm">Role: <span className="capitalize font-medium text-blue-600">{user.role}</span></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[["Exams Taken", "0"], ["Alerts Logged", "0"], ["Sessions", "0"]].map(([label, val]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{val}</p>
              <p className="text-gray-600 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
