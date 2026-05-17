"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import BrandLogo from "@/components/ui/BrandLogo";
import { analyzeRepository, clearRepository } from "@/services/repo";
import { askRepository } from "@/services/ai";
import { analyzePR, clearPRResult } from "@/services/pr";
import { generateDocs } from "@/services/docs";
import { analyzeDebt } from "@/services/debt";
import { RepoAnalysisResponse } from "@/types";

// ── Icons ─────────────────────────────────────────────────────────────────────

const Icon = {
  Link: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
    </svg>
  ),
  Scan: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm9-1a1 1 0 000 2h2v2a1 1 0 102 0V4a1 1 0 00-1-1h-3zM3 12a1 1 0 011 1v2h2a1 1 0 110 2H4a1 1 0 01-1-1v-3a1 1 0 011-1zm13 1a1 1 0 10-2 0v2h-2a1 1 0 100 2h3a1 1 0 001-1v-3z" clipRule="evenodd"/>
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
    </svg>
  ),
  Chevron: () => (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" clipRule="evenodd"/>
    </svg>
  ),
  Spinner: ({ size = 14 }: { size?: number }) => (
    <svg
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      className="spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
};

// ── Shared primitives ─────────────────────────────────────────────────────────

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 fade-up">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 spin" />
        <div className="absolute inset-2 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-400 pulse-dot" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#c8d0e8]">{label}</p>
        <p className="text-xs text-[#4a5568] mt-1">This may take 30–60 seconds</p>
      </div>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/25 bg-rose-500/8 fade-up">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-rose-400 shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      <p className="text-sm text-rose-300 leading-relaxed">{msg}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-[11px] text-[#8892a4] hover:text-white border border-white/[0.08] hover:border-white/[0.16] px-2.5 py-1.5 rounded-lg transition-all"
    >
      {copied ? <Icon.Check /> : <Icon.Copy />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Panel({ title, subtitle, children, action }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] overflow-hidden fade-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-sm font-semibold text-[#f0f4ff]">{title}</h3>
          {subtitle && <p className="text-xs text-[#4a5568] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function sanitizeAI(raw: string): string {
  if (!raw) return "";
  let text = raw.trim();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") {
        text = parsed;
      } else if (typeof parsed === "object" && parsed !== null) {
        const val = Object.values(parsed).find((v) => typeof v === "string");
        if (typeof val === "string") text = val as string;
      }
    } catch { /* not JSON, use as-is */ }
  }
  return text.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function AIOutput({ content }: { content: string }) {
  return (
    <div className="ai-prose">
      <ReactMarkdown>{sanitizeAI(content)}</ReactMarkdown>
    </div>
  );
}

function SkeletonBlock({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${70 + Math.random() * 30}%`, opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/>
      </svg>
    ),
  },
  {
    id: "chat" as const,
    label: "AI Chat",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M2.5 2A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4v2.5a.5.5 0 00.854.354L7.207 12H13.5a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 2h-11z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    id: "pr" as const,
    label: "PR Analyzer",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    id: "docs" as const,
    label: "Docs Forge",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clipRule="evenodd"/>
        <path d="M9.5 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z"/>
      </svg>
    ),
  },
  {
    id: "debt" as const,
    label: "Debt Radar",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M8.533.133a1 1 0 00-1.066 0l-7 4.5A1 1 0 000 5.5v5a1 1 0 00.467.867l7 4.5a1 1 0 001.066 0l7-4.5A1 1 0 0016 10.5v-5a1 1 0 00-.467-.867l-7-4.5zM8 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
      </svg>
    ),
  },
] as const;

type Tab = (typeof NAV)[number]["id"];

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoUrlError, setRepoUrlError] = useState<string | null>(null);
  const [prUrlError, setPrUrlError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [prLoading, setPrLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [debtLoading, setDebtLoading] = useState(false);

  const [data, setData] = useState<RepoAnalysisResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<{ q: string; a: string | null; err?: string }[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [prResult, setPrResult] = useState<any>(null);
  const [docsType, setDocsType] = useState("README");
  const [docsResult, setDocsResult] = useState<any>(null);
  const [generatedDocsType, setGeneratedDocsType] = useState("README");
  const [debtResult, setDebtResult] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleAnalyze() {
    if (!repoUrl.trim()) return;

    // Validate GitHub repo URL format
    const repoPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
    if (!repoPattern.test(repoUrl.trim())) {
      setRepoUrlError("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)");
      return;
    }
    setRepoUrlError(null);
    try {
      setLoading(true);
      setData(null);
      setChatMessages([]);
      setPrResult(null);
      setDocsResult(null);
      setDebtResult(null);
      const result = await analyzeRepository(repoUrl.trim());
      setData(result);
      setTab("overview");
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    if (!data?.repo_id || !chatQuestion.trim()) return;
    const q = chatQuestion.trim();
    setChatQuestion("");
    setChatMessages((prev) => [...prev, { q, a: null }]);
    try {
      setChatLoading(true);
      const result = await askRepository(data.repo_id, q);
      const answer = typeof result === "string" ? result : result.answer || JSON.stringify(result, null, 2);
      setChatMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { q, a: answer };
        return next;
      });
    } catch (e: any) {
      const err = e?.response?.data?.detail || "Chat failed. Please try again.";
      setChatMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { q, a: null, err };
        return next;
      });
    } finally {
      setChatLoading(false);
    }
  }

  async function handlePR() {
    if (!prUrl.trim()) return;

    // Validate GitHub PR URL format
    const prPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+\/?$/;
    if (!prPattern.test(prUrl.trim())) {
      setPrUrlError("Please enter a valid GitHub PR URL (e.g. https://github.com/owner/repo/pull/123)");
      return;
    }
    setPrUrlError(null);
    try {
      setPrLoading(true);
      const result = await analyzePR(prUrl.trim());
      setPrResult(result);
    } catch (e: any) {
      setPrResult({ error: e?.response?.data?.detail || "PR analysis failed." });
    } finally {
      setPrLoading(false);
    }
  }

  async function handleDocs() {
    if (!data?.repo_id) return;
    try {
      setDocsLoading(true);
      const result = await generateDocs(data.repo_id, docsType);
      setDocsResult(result);
      setGeneratedDocsType(docsType);
    } catch (e: any) {
      setDocsResult({ error: e?.response?.data?.detail || "Documentation generation failed." });
    } finally {
      setDocsLoading(false);
    }
  }

  async function handleDebt() {
    if (!data?.repo_id) return;
    try {
      setDebtLoading(true);
      const result = await analyzeDebt(data.repo_id);
      setDebtResult(result);
    } catch (e: any) {
      setDebtResult({ error: e?.response?.data?.detail || "Debt analysis failed." });
    } finally {
      setDebtLoading(false);
    }
  }

  async function handleNewAnalysis() {
    // Clear backend context for current repo
    if (data?.repo_id) {
      try {
        await clearRepository(data.repo_id);
      } catch {
        // Context may already be gone — proceed anyway
      }
    }
    // Reset all frontend state
    setData(null);
    setRepoUrl("");
    setRepoUrlError(null);
    setChatMessages([]);
    setPrResult(null);
    setPrUrl("");
    setPrUrlError(null);
    setDocsResult(null);
    setDebtResult(null);
    setTab("overview");
  }

  const repoName = repoUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const analysisText = data
    ? typeof data.bob_analysis === "string"
      ? data.bob_analysis
      : JSON.stringify(data.bob_analysis, null, 2)
    : "";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#080a0f] text-[#f0f4ff] flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <header className="h-14 shrink-0 border-b border-white/[0.06] bg-[#080a0f]/95 backdrop-blur-2xl flex items-center px-4 gap-3 z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group hover:opacity-80 transition-opacity">
          <BrandLogo variant="icon" size="sm" />
          <span className="text-sm font-semibold text-[#f0f4ff] hidden sm:inline">CodeSherlock X</span>
        </Link>

        {/* Active repo badge — only shown after analysis */}
        {data && (
          <div className="ml-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[11px] text-[#8892a4] font-mono hidden sm:block">{repoName}</span>
            <span className="text-[#4a5568] hidden sm:block">·</span>
            <span className="chip">{data.framework}</span>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className="w-48 shrink-0 border-r border-white/[0.06] bg-[#080a0f] flex flex-col py-3 hidden md:flex">
          <div className="px-2 mb-1">
            <p className="text-[10px] font-mono text-[#4a5568] uppercase tracking-widest px-2 mb-2">Tools</p>
            <nav className="flex flex-col gap-0.5">
              {NAV.map((item) => {
                const needsRepo = item.id !== "pr" && item.id !== "overview";
                const disabled = needsRepo && !data;
                const isActive = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => !disabled && setTab(item.id)}
                    disabled={disabled}
                    className={`nav-item ${isActive ? "active" : ""} ${disabled ? "disabled" : ""}`}
                  >
                    <span className={isActive ? "text-indigo-400" : "text-[#4a5568]"}>{item.icon}</span>
                    {item.label}
                    {item.id === "chat" && chatMessages.length > 0 && (
                      <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-mono">
                        {chatMessages.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {data && (
            <div className="mx-2 mt-3 p-3 rounded-xl bg-[#0d1017] border border-white/[0.06]">
              <p className="text-[10px] text-[#4a5568] mb-1.5 font-mono uppercase tracking-wider">Active repo</p>
              <p className="text-[11px] text-[#c8d0e8] font-mono leading-tight break-all">{repoName || "—"}</p>
              {data.framework && (
                <span className="inline-flex items-center mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                  {data.framework}
                </span>
              )}
              <button
                onClick={handleNewAnalysis}
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#8892a4] hover:text-white border border-white/[0.08] hover:border-indigo-500/30 hover:bg-indigo-500/5 px-3 py-2 rounded-lg transition-all"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" clipRule="evenodd"/>
                  <path d="M8 5.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 018 5.5z"/>
                </svg>
                New Analysis
              </button>
            </div>
          )}

          <div className="mt-auto px-4 py-3 border-t border-white/[0.06]">
            <p className="text-[10px] text-[#4a5568] leading-relaxed">
              IBM Bob AI
            </p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-1 p-2 border-b border-white/[0.06] overflow-x-auto bg-[#080a0f]">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${tab === item.id ? "bg-indigo-500/15 text-indigo-300" : "text-[#8892a4]"}`}
              >
                {item.icon}{item.label}
              </button>
            ))}
          </div>

          <div className="p-5 max-w-4xl mx-auto space-y-4">

            {/* ── EMPTY STATE ── only when no repo analyzed and not on PR tab ── */}
            {!data && !loading && tab !== "pr" && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] text-center fade-up px-4">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>
                    </svg>
                  </div>
                  <div className="absolute -inset-6 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
                </div>

                <h2 className="text-2xl font-semibold mb-2 tracking-tight">Analyze a repository</h2>
                <p className="text-sm text-[#8892a4] max-w-sm leading-relaxed mb-8">
                  Paste any public GitHub URL below and press Analyze to get instant AI-powered insights.
                </p>

                {/* ── Centered URL input ── */}
                <div className="w-full max-w-xl mb-6">
                  <div className={`flex items-center gap-2 bg-[#0d1017] border rounded-2xl px-4 py-3 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.12)] transition-all shadow-lg shadow-black/30 ${
                    repoUrlError
                      ? "border-rose-500/60 focus-within:border-rose-500/80"
                      : "border-white/[0.10] focus-within:border-indigo-500/60"
                  }`}>
                    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 shrink-0 ${repoUrlError ? "text-rose-400" : "text-[#4a5568]"}`}>
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="https://github.com/owner/repository"
                      value={repoUrl}
                      onChange={(e) => { setRepoUrl(e.target.value); setRepoUrlError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4a5568] text-[#f0f4ff]"
                    />
                    {repoUrl && (
                      <button onClick={() => { setRepoUrl(""); setRepoUrlError(null); }} className="text-[#4a5568] hover:text-[#8892a4] transition-colors shrink-0">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !repoUrl.trim()}
                      className="shrink-0 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_16px_rgba(99,102,241,0.4)] active:scale-95 flex items-center gap-1.5"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm9-1a1 1 0 000 2h2v2a1 1 0 102 0V4a1 1 0 00-1-1h-3zM3 12a1 1 0 011 1v2h2a1 1 0 110 2H4a1 1 0 01-1-1v-3a1 1 0 011-1zm13 1a1 1 0 10-2 0v2h-2a1 1 0 100 2h3a1 1 0 001-1v-3z" clipRule="evenodd"/>
                      </svg>
                      Analyze
                    </button>
                  </div>
                  {repoUrlError && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-rose-400 shrink-0">
                        <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 018 5zm0 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs text-rose-400">{repoUrlError}</p>
                    </div>
                  )}
                </div>

                {/* ── Sample repos ── */}
                <div className="w-full max-w-xl">
                  <p className="text-[11px] text-[#4a5568] uppercase tracking-widest font-mono mb-3">Try a sample repository</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { label: "pallets/flask", url: "https://github.com/pallets/flask", lang: "Python", color: "#3b82f6" },
                      { label: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi", lang: "Python", color: "#06b6d4" },
                      { label: "django/django", url: "https://github.com/django/django", lang: "Python", color: "#10b981" },
                    ].map((repo) => (
                      <button
                        key={repo.url}
                        onClick={() => { setRepoUrl(repo.url); }}
                        className="group flex flex-col items-start gap-2 border border-white/[0.07] rounded-xl px-4 py-3 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#4a5568] shrink-0">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                          </svg>
                          <span className="text-xs font-mono text-[#c8d0e8] group-hover:text-white transition-colors truncate">{repo.label}</span>
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#4a5568] group-hover:text-indigo-400 transition-colors ml-auto shrink-0">
                            <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                          style={{ color: repo.color, borderColor: `${repo.color}30`, background: `${repo.color}10` }}
                        >
                          {repo.lang}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── LOADING ── */}
            {loading && <Spinner label="Cloning and analyzing repository..." />}

            {/* ── PR ANALYZER — always available, no repo needed ── */}
            {tab === "pr" && !loading && (
              <div className="space-y-4 fade-up">
                <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-400">
                        <path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">PR Impact Analyzer</h3>
                      <p className="text-[11px] text-[#4a5568]">Risks, affected modules, regression analysis, recommended tests</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://github.com/owner/repo/pull/123"
                      value={prUrl}
                      onChange={(e) => { setPrUrl(e.target.value); setPrUrlError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && handlePR()}
                      className={`input-base flex-1 ${prUrlError ? "!border-rose-500/60" : ""}`}
                    />
                    <button onClick={handlePR} disabled={prLoading || !prUrl.trim()} className="btn-primary shrink-0">
                      {prLoading ? <><Icon.Spinner size={13} /> Analyzing</> : "Analyze PR"}
                    </button>
                  </div>
                  {prUrlError && (
                    <div className="flex items-center gap-2 mt-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-rose-400 shrink-0">
                        <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 018 5zm0 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs text-rose-400">{prUrlError}</p>
                    </div>
                  )}
                </div>

                {prLoading && <Spinner label="Fetching and analyzing pull request..." />}
                {prResult?.error && <ErrorBanner msg={prResult.error} />}
                {prResult?.error && (
                  <button
                    onClick={() => { setPrResult(null); setPrUrl(""); }}
                    className="btn-ghost text-xs mt-2"
                  >
                    ← Try another PR
                  </button>
                )}
                {prResult && !prResult.error && (
                  <Panel
                    title="PR Analysis Report"
                    action={
                      <div className="flex items-center gap-2">
                        <CopyButton text={typeof prResult === "string" ? prResult : prResult.analysis || JSON.stringify(prResult, null, 2)} />
                        <button
                          onClick={() => { setPrResult(null); setPrUrl(""); }}
                          className="flex items-center gap-1.5 text-[11px] text-[#8892a4] hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-all"
                          title="Clear result and analyze another PR"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" clipRule="evenodd"/>
                          </svg>
                          Clear
                        </button>
                      </div>
                    }
                  >
                    <AIOutput content={typeof prResult === "string" ? prResult : prResult.analysis || JSON.stringify(prResult, null, 2)} />
                  </Panel>
                )}
              </div>
            )}

            {/* ── CONTENT — requires repo analysis ── */}
            {data && !loading && (
              <>
                {/* OVERVIEW */}
                {tab === "overview" && (
                  <div className="space-y-4 fade-up">
                    {/* Repo header card */}
                    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400">
                              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-[11px] text-emerald-400 font-mono font-medium">Analysis complete</span>
                            </div>
                            <h2 className="text-base font-semibold font-mono">{repoName}</h2>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="chip">{data.framework}</span>
                              <span className="chip">{data.important_files.length} key files</span>
                              <span className="chip text-[#4a5568]">{data.repo_id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                          {(["chat", "pr", "docs", "debt"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTab(t)}
                              className="text-[11px] px-3 py-1.5 rounded-lg border border-white/[0.08] text-[#8892a4] hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all capitalize"
                            >
                              {NAV.find((n) => n.id === t)?.label}
                            </button>
                          ))}
                          <button
                            onClick={handleNewAnalysis}
                            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-white/[0.08] text-[#8892a4] hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all ml-1"
                            title="Clear this repo and analyze a new one"
                          >
                            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm-.75 4.75a.75.75 0 011.5 0v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5z" clipRule="evenodd"/>
                            </svg>
                            New Repo
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Key files */}
                    <Panel title="Key Files" subtitle={`${data.important_files.length} important files detected`}>
                      <div className="flex flex-wrap gap-2">
                        {data.important_files.map((f) => (
                          <span key={f} className="chip hover:border-indigo-500/30 hover:text-indigo-300 transition-colors cursor-default">
                            {f}
                          </span>
                        ))}
                      </div>
                    </Panel>

                    {/* Directory tree */}
                    <Panel title="Directory Structure">
                      <pre className="text-[12px] font-mono text-[#8892a4] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {data.directory_tree}
                      </pre>
                    </Panel>

                    {/* AI analysis */}
                    <Panel
                      title="AI Architecture Analysis"
                      subtitle="Powered by IBM Bob AI"
                      action={<CopyButton text={analysisText} />}
                    >
                      <AIOutput content={analysisText} />
                    </Panel>
                  </div>
                )}

                {/* AI CHAT */}
                {tab === "chat" && (
                  <div className="flex flex-col gap-4 fade-up">
                    {/* Chat header */}
                    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] p-5">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-cyan-400">
                            <path fillRule="evenodd" d="M2.5 2A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4v2.5a.5.5 0 00.854.354L7.207 12H13.5a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 2h-11z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">Ask Your Repository</h3>
                          <p className="text-[11px] text-[#4a5568]">Context-aware answers from <span className="text-[#8892a4] font-mono">{repoName}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    {chatMessages.length > 0 && (
                      <div className="space-y-4">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className="space-y-3">
                            {/* User bubble */}
                            <div className="flex justify-end">
                              <div className="max-w-[80%] bg-indigo-500/15 border border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
                                <p className="text-sm text-[#c8d0e8] leading-relaxed">{msg.q}</p>
                              </div>
                            </div>
                            {/* AI bubble */}
                            {msg.err ? (
                              <ErrorBanner msg={msg.err} />
                            ) : msg.a ? (
                              <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                                  AI
                                </div>
                                <div className="flex-1 bg-[#0d1017] border border-white/[0.07] rounded-2xl rounded-tl-sm px-5 py-4">
                                  <AIOutput content={msg.a} />
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                    <span className="text-[10px] text-[#4a5568] font-mono">IBM Bob AI</span>
                                    <CopyButton text={msg.a} />
                                  </div>
                                </div>
                              </div>
                            ) : chatLoading && i === chatMessages.length - 1 ? (
                              <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                                  AI
                                </div>
                                <div className="flex-1 bg-[#0d1017] border border-white/[0.07] rounded-2xl rounded-tl-sm px-5 py-4">
                                  <div className="flex items-center gap-2 text-[#8892a4]">
                                    <Icon.Spinner size={14} />
                                    <span className="text-xs">Thinking…</span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    )}

                    {chatMessages.length === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "How is authentication handled?",
                          "What's the main entry point?",
                          "Where are the API routes defined?",
                          "What design patterns are used?",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => { setChatQuestion(q); }}
                            className="text-left text-xs text-[#8892a4] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="sticky bottom-0 bg-[#080a0f] pt-2 pb-1">
                      <div className="flex gap-2 bg-[#0d1017] border border-white/[0.08] rounded-2xl p-2 focus-within:border-indigo-500/40 transition-colors">
                        <textarea
                          rows={2}
                          placeholder="Ask anything about the codebase…"
                          value={chatQuestion}
                          onChange={(e) => setChatQuestion(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4a5568] resize-none px-2 py-1 text-[#f0f4ff]"
                        />
                        <button
                          onClick={handleAsk}
                          disabled={chatLoading || !chatQuestion.trim()}
                          className="self-end btn-primary px-3 py-2 text-xs shrink-0"
                        >
                          {chatLoading ? <Icon.Spinner size={13} /> : <Icon.Send />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[#4a5568] mt-1.5 px-1">Press Enter to send</p>
                    </div>
                  </div>
                )}

                {/* DOCS FORGE */}
                {tab === "docs" && (
                  <div className="space-y-4 fade-up">
                    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-emerald-400">
                            <path fillRule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clipRule="evenodd"/>
                            <path d="M9.5 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">Documentation Forge</h3>
                          <p className="text-[11px] text-[#4a5568]">Generate professional docs from actual code</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["README", "Architecture", "Onboarding", "API Documentation"].map((type) => (
                          <button
                            key={type}
                            onClick={() => { setDocsType(type); setDocsResult(null); }}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all
                              ${docsType === type
                                ? "bg-emerald-500/12 text-emerald-300 border-emerald-500/30"
                                : "border-white/[0.08] text-[#8892a4] hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03]"
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <button onClick={handleDocs} disabled={docsLoading} className="btn-primary">
                        {docsLoading
                          ? <><Icon.Spinner size={13} /> Generating…</>
                          : <>Generate {docsType}</>
                        }
                      </button>
                    </div>

                    {docsLoading && <Spinner label={`Generating ${docsType.endsWith("Documentation") ? docsType : docsType + " docs"}...`} />}
                    {docsResult?.error && <ErrorBanner msg={docsResult.error} />}
                    {docsResult && !docsResult.error && (() => {
                      const content = typeof docsResult === "string" ? docsResult : docsResult.documentation || JSON.stringify(docsResult, null, 2);
                      return (
                        <Panel title={generatedDocsType.endsWith("Documentation") ? generatedDocsType : `${generatedDocsType} Documentation`} action={<CopyButton text={content} />}>
                          <AIOutput content={content} />
                        </Panel>
                      );
                    })()}
                  </div>
                )}

                {/* DEBT RADAR */}
                {tab === "debt" && (
                  <div className="space-y-4 fade-up">
                    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1017] p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-rose-400">
                            <path fillRule="evenodd" d="M8.533.133a1 1 0 00-1.066 0l-7 4.5A1 1 0 000 5.5v5a1 1 0 00.467.867l7 4.5a1 1 0 001.066 0l7-4.5A1 1 0 0016 10.5v-5a1 1 0 00-.467-.867l-7-4.5zM8 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">Technical Debt Radar</h3>
                          <p className="text-[11px] text-[#4a5568]">Maintainability score, risky modules, architectural concerns</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 mb-4">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-rose-400 shrink-0">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-xs text-[#8892a4]">
                          This analysis scans for technical debt, coupling issues, complexity hotspots, and long-term engineering risks.
                        </p>
                      </div>
                      <button onClick={handleDebt} disabled={debtLoading} className="btn-danger">
                        {debtLoading ? <><Icon.Spinner size={13} /> Scanning…</> : "Run Debt Analysis"}
                      </button>
                    </div>

                    {debtLoading && <Spinner label="Scanning for technical debt and engineering risks..." />}
                    {debtResult?.error && <ErrorBanner msg={debtResult.error} />}
                    {debtResult && !debtResult.error && (() => {
                      const content = typeof debtResult === "string" ? debtResult : debtResult.analysis || JSON.stringify(debtResult, null, 2);
                      return (
                        <Panel title="Debt Analysis Report" action={<CopyButton text={content} />}>
                          <AIOutput content={content} />
                        </Panel>
                      );
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
