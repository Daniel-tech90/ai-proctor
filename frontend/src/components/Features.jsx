import React from "react";

const features = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    title: "Face Recognition",
    desc: "Continuously verifies student identity using deep learning facial recognition to prevent impersonation.",
    color: "bg-blue-50 text-blue-600",
    badge: "Identity",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ),
    title: "Eye Movement Tracking",
    desc: "Monitors gaze direction and eye movement patterns to detect when students look away from the screen.",
    color: "bg-indigo-50 text-indigo-600",
    badge: "Gaze AI",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    title: "Object Detection",
    desc: "Detects unauthorized objects like phones, books, or secondary screens using computer vision.",
    color: "bg-violet-50 text-violet-600",
    badge: "CV",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    ),
    title: "Voice Monitoring",
    desc: "AI-powered audio analysis detects background voices, conversations, and other suspicious sounds.",
    color: "bg-cyan-50 text-cyan-600",
    badge: "Audio AI",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
    ),
    title: "Browser Activity Monitoring",
    desc: "Tracks tab switching, copy-paste actions, and fullscreen exits to prevent online resource cheating.",
    color: "bg-amber-50 text-amber-600",
    badge: "Behavior",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    title: "AI-Based Cheating Detection",
    desc: "Machine learning models analyze behavioral patterns to automatically flag and score suspicious activity.",
    color: "bg-rose-50 text-rose-600",
    badge: "ML Model",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Core Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Powered by <span className="text-blue-600">Advanced AI</span> Technology
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Six layers of intelligent monitoring working simultaneously to ensure exam integrity and fairness.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc, color, badge }) => (
            <div key={title} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${color}`}>{badge}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
