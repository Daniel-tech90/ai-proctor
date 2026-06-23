import React from "react";

export default function EmptyState({ title = "No Categories Found", subtitle = "" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">{title}</h2>
      <div className="mb-4 relative">
        <svg width="300" height="220" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dots */}
          <circle cx="60" cy="50" r="8" fill="#6C63FF" />
          <circle cx="240" cy="40" r="5" fill="#6C63FF" />
          <circle cx="270" cy="150" r="7" fill="#6C63FF" />
          <circle cx="30" cy="160" r="5" fill="#6C63FF" />
          <circle cx="150" cy="210" r="6" fill="#6C63FF" />
          <circle cx="80" cy="200" r="4" fill="#d1d5db" />
          <circle cx="230" cy="195" r="4" fill="#d1d5db" />
          {/* Browser window */}
          <rect x="55" y="60" width="170" height="130" rx="8" fill="#e5e7eb" />
          <circle cx="70" cy="72" r="3" fill="#9ca3af" />
          <circle cx="80" cy="72" r="3" fill="#9ca3af" />
          <circle cx="90" cy="72" r="3" fill="#9ca3af" />
          {/* Text lines */}
          <text x="75" y="105" fontSize="22" fill="#9ca3af" fontWeight="bold">T</text>
          <text x="90" y="100" fontSize="14" fill="#9ca3af">T</text>
          <rect x="75" y="112" width="80" height="5" rx="2" fill="#d1d5db" />
          <rect x="75" y="122" width="100" height="5" rx="2" fill="#d1d5db" />
          <rect x="75" y="132" width="90" height="5" rx="2" fill="#d1d5db" />
          <rect x="75" y="142" width="85" height="5" rx="2" fill="#d1d5db" />
          <rect x="75" y="152" width="95" height="5" rx="2" fill="#d1d5db" />
          <rect x="75" y="162" width="70" height="5" rx="2" fill="#d1d5db" />
          {/* Magnifying glass */}
          <circle cx="185" cy="130" r="32" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="6" />
          <line x1="207" y1="152" x2="230" y2="178" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
          {/* Hand */}
          <ellipse cx="238" cy="182" rx="18" ry="12" fill="#f9a589" transform="rotate(-40 238 182)" />
          <rect x="220" y="175" width="30" height="20" rx="5" fill="#6C63FF" transform="rotate(-40 220 175)" />
        </svg>
      </div>
      {subtitle && <p className="text-gray-500 text-sm max-w-xs">{subtitle}</p>}
    </div>
  );
}
