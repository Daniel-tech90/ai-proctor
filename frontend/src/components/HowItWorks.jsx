import React from "react";

const steps = [
  {
    step: "01",
    title: "Student Authentication",
    desc: "Student logs in and completes AI-powered identity verification using face recognition and government ID validation.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    ),
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    title: "AI Monitoring Starts",
    desc: "Real-time webcam, audio, and browser monitoring activates. Multiple AI models run concurrently to track all activity.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
    color: "from-indigo-500 to-indigo-600",
  },
  {
    step: "03",
    title: "Suspicious Activity Detection",
    desc: "ML algorithms analyze behavioral signals. Any anomaly triggers an instant alert with evidence capture and risk scoring.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    color: "from-violet-500 to-violet-600",
  },
  {
    step: "04",
    title: "Automated Exam Report",
    desc: "After the exam, a detailed AI-generated report is produced with a timeline of events, violation logs, and integrity score.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">Process</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            How <span className="text-blue-600">AI Proctor</span> Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A seamless 4-step process that keeps every exam secure from start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, title, desc, icon, color }) => (
              <div key={step} className="relative flex flex-col items-center text-center group">
                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4 group-hover:-translate-y-1 transition-transform duration-300 relative z-10`}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
                </div>
                {/* Step number badge */}
                <span className="text-[10px] font-black text-gray-400 tracking-widest mb-2">STEP {step}</span>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
