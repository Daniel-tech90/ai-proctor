import React from "react";

export default function EmptyState({ title = "No Categories Found", subtitle = "There are no categories available at the moment." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="#EFF6FF" />
          <rect x="35" y="38" width="50" height="44" rx="6" fill="#BFDBFE" />
          <rect x="42" y="30" width="36" height="44" rx="6" fill="white" stroke="#93C5FD" strokeWidth="2" />
          <line x1="50" y1="42" x2="70" y2="42" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="50" x2="70" y2="50" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="58" x2="62" y2="58" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <circle cx="78" cy="78" r="16" fill="#3B82F6" />
          <line x1="73" y1="78" x2="83" y2="78" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="73" x2="78" y2="83" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-xs">{subtitle}</p>
    </div>
  );
}
