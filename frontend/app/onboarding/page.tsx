"use client";

import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f0f4ff] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] py-6 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <BrandLogo variant="full" size="md" priority />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 inline-block">
            <BrandLogo variant="icon" size="lg" />
          </div>

          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Welcome to CodeSherlock X
          </h1>

          <p className="text-lg text-[#8892a4] mb-12 leading-relaxed">
            AI-powered repository intelligence. Analyze GitHub repositories,
            get architectural insights, PR reviews, and documentation in seconds.
          </p>

          <div className="space-y-3 flex flex-col">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Start Analyzing
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-[#8892a4] hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              Learn More
            </Link>
          </div>

          <p className="text-xs text-[#4a5568] mt-12">
            No sign-up required · Free to use · Powered by IBM Bob AI
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-[#4a5568]">
          <p>© 2026 CodeSherlock X. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
