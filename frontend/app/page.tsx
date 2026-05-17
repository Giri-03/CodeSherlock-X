import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import BrandLogo from "@/components/ui/BrandLogo";

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    accent: "#6366f1",
    accentDim: "rgba(99,102,241,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 4a2 2 0 012-2h4.586A2 2 0 0110 2.586L13.414 6A2 2 0 0114 7.414V16a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/>
      </svg>
    ),
    title: "Repository Intelligence",
    desc: "Deep-scan any GitHub repo. Maps every module, dependency, and architectural pattern in under 60 seconds.",
  },
  {
    accent: "#06b6d4",
    accentDim: "rgba(6,182,212,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
      </svg>
    ),
    title: "Ask Your Codebase",
    desc: "Natural language queries answered with full repository context. No more digging through files manually.",
  },
  {
    accent: "#8b5cf6",
    accentDim: "rgba(139,92,246,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    title: "PR Impact Analyzer",
    desc: "Understand exactly what a pull request changes, what it risks, and what tests it needs before merging.",
  },
  {
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
      </svg>
    ),
    title: "Documentation Forge",
    desc: "Generate READMEs, architecture docs, and onboarding guides from actual code — not guesses.",
  },
  {
    accent: "#f43f5e",
    accentDim: "rgba(244,63,94,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
    ),
    title: "Technical Debt Radar",
    desc: "Surface hidden complexity, risky modules, and long-term architectural concerns before they compound.",
  },
  {
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
      </svg>
    ),
    title: "Engineering Risk Metrics",
    desc: "Visual dashboard of maintainability, scalability, security, and complexity scores across your codebase.",
  },
];

const steps = [
  { n: "01", color: "#6366f1", title: "Paste a GitHub URL", desc: "Any public repository. No OAuth, no setup, no configuration needed." },
  { n: "02", color: "#8b5cf6", title: "AI analyzes the codebase", desc: "IBM Bob AI reads the structure, frameworks, modules, and patterns across your entire repo." },
  { n: "03", color: "#06b6d4", title: "Explore 6 AI-powered tools", desc: "Chat, PR analysis, docs generation, debt radar — all context-aware." },
];

const stats = [
  { value: "< 60s", label: "Full repo analysis", color: "#818cf8" },
  { value: "6", label: "AI-powered tools", color: "#22d3ee" },
  { value: "100%", label: "Context-aware", color: "#34d399" },
  { value: "Free", label: "No sign-up needed", color: "#fbbf24" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#f0f4ff] overflow-x-hidden">

      {/* ── NAV ── */}
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        {/* Ambient orbs */}
        <div className="orb w-[700px] h-[500px] bg-indigo-600/10 top-[-100px] left-1/2 -translate-x-1/2" />
        <div className="orb w-[400px] h-[400px] bg-violet-600/8 top-[100px] left-[10%]" />
        <div className="orb w-[300px] h-[300px] bg-cyan-500/6 top-[200px] right-[10%]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-xs font-medium mb-8 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
            Powered by IBM Bob AI · Free to use
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] mb-6 fade-up-1">
            AI Intelligence for{" "}
            <span className="grad-text">Every Repository</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8892a4] max-w-2xl mx-auto leading-relaxed mb-10 fade-up-2">
            Paste a GitHub URL. Get instant architecture analysis, AI chat, PR reviews,
            auto-generated docs, and technical debt reports — all in one dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 fade-up-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-[0.98]"
            >
              Analyze a Repository
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" clipRule="evenodd"/>
              </svg>
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-[#8892a4] hover:text-white px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              See all features
            </a>
          </div>
        </div>

        {/* Terminal mockup */}
        <div className="relative max-w-3xl mx-auto mt-16 fade-up-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1017] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#080a0f]">
              <div className="w-3 h-3 rounded-full bg-[#f43f5e]/50" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]/50" />
              <div className="w-3 h-3 rounded-full bg-[#10b981]/50" />
              <span className="ml-3 text-[11px] text-[#4a5568] font-mono">codesherlock — analysis engine</span>
            </div>
            <div className="p-6 font-mono text-[13px] space-y-2.5">
              <div className="flex gap-3 items-start">
                <span className="text-indigo-400 mt-0.5">›</span>
                <span className="text-[#8892a4]">Analyzing <span className="text-white font-medium">github.com/pallets/flask</span></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#4a5568] mt-0.5">·</span>
                <span className="text-[#4a5568]">Cloning repository to temp workspace...</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#4a5568] mt-0.5">·</span>
                <span className="text-[#4a5568]">Parsing 847 files across 23 modules</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#10b981] mt-0.5">✓</span>
                <span className="text-[#8892a4]">Framework: <span className="text-[#34d399]">Flask / Python 3.x</span></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#10b981] mt-0.5">✓</span>
                <span className="text-[#8892a4]">Architecture: <span className="text-[#34d399]">Blueprint-based MVC</span></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#06b6d4] mt-0.5">⟳</span>
                <span className="text-[#06b6d4]">IBM Bob AI generating architecture analysis...</span>
              </div>
              <div className="mt-3 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
                <p className="text-[#818cf8] text-[12px] leading-relaxed">
                  <span className="text-indigo-300 font-semibold">Architecture Overview —</span>{" "}
                  Flask uses a Blueprint-based modular architecture with a centralized application factory pattern.
                  Core routing is handled through decorators. The codebase shows clean separation of concerns
                  with 4 main modules: routing, templating, session management, and WSGI handling...
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-indigo-500/15 blur-2xl rounded-full" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-14 px-6 border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <p className="text-3xl font-bold mb-1 transition-transform group-hover:scale-105" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-[#8892a4]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-[0.15em] mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything your team needs to{" "}
              <span className="grad-text">move faster</span>
            </h2>
            <p className="text-[#8892a4] text-sm mt-3 max-w-lg mx-auto">
              Six AI-powered tools, all context-aware from your repository.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-[#0d1017] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.accentDim, color: f.accent, border: `1px solid ${f.accent}25` }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2 text-[#f0f4ff]">{f.title}</h3>
                <p className="text-xs text-[#8892a4] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.15em] mb-3">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Up and running in seconds</h2>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="flex gap-5 p-6 rounded-2xl border border-white/[0.06] bg-[#0d1017] hover:border-white/[0.10] transition-all duration-200 group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span
                  className="text-2xl font-bold font-mono opacity-30 group-hover:opacity-60 transition-opacity shrink-0 w-10 leading-none pt-0.5"
                  style={{ color: s.color }}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-[#8892a4] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="orb w-[600px] h-[400px] bg-indigo-600/8 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to understand your codebase?
          </h2>
          <p className="text-[#8892a4] text-sm mb-8 leading-relaxed max-w-md mx-auto">
            No sign-up. No credit card. Paste a GitHub URL and get instant AI-powered engineering insights.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-[0.98]"
          >
            Launch Dashboard
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="w-8 h-auto">
                <BrandLogo variant="icon" size="sm" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">CodeSherlock X</span>
            </div>
          </Link>
          <p className="text-[11px] text-[#4a5568]">
            Built with Next.js · FastAPI · IBM Bob AI
          </p>
          <div className="flex gap-5 text-[11px] text-[#4a5568]">
            <a href="#" className="hover:text-[#8892a4] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#8892a4] transition-colors">Docs</a>
            <a href="#" className="hover:text-[#8892a4] transition-colors">API</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
