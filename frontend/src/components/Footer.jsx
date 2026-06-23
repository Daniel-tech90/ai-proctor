import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-white font-bold">AI <span className="text-blue-400">Proctor</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Intelligent AI-powered exam proctoring for a fair, secure, and transparent evaluation experience.
            </p>
            <div className="flex gap-3">
              {["twitter", "linkedin", "github"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                  <span className="text-xs font-bold text-gray-400 capitalize">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: ["Features", "How It Works", "Dashboard", "Pricing", "API Docs"] },
            { title: "Company", links: ["About Us", "Research", "Blog", "Careers", "Press Kit"] },
            { title: "Contact", links: ["support@aiproctor.io", "+1 (800) 123-4567", "123 AI Boulevard", "San Francisco, CA", "94105"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs">
          <p>© {new Date().getFullYear()} AI Proctor. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
