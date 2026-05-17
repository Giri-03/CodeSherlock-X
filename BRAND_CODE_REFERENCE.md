# 💻 CodeSherlock X Brand Implementation - Code Reference

## Component: BrandLogo.tsx

**Location:** `/components/ui/BrandLogo.tsx`

```typescript
import Image from "next/image";

type Variant = "full" | "icon";
type Size = "sm" | "md" | "lg" | "xl";

interface BrandLogoProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  priority?: boolean;
}

// Size mappings for each variant
const sizeMap: Record<Variant, Record<Size, { width: number; height: number }>> = {
  full: {
    sm: { width: 100, height: 32 },
    md: { width: 200, height: 46 },
    lg: { width: 380, height: 72 },
    xl: { width: 540, height: 100 },
  },
  icon: {
    sm: { width: 30, height: 30 },
    md: { width: 44, height: 44 },
    lg: { width: 60, height: 60 },
    xl: { width: 80, height: 80 },
  },
};

export default function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const dimensions = sizeMap[variant][size];
  const src =
    variant === "full"
      ? "/branding/codesherlockx-full-logo.png"
      : "/branding/codesherlockx-icon.png";

  return (
    <div
      className={`flex items-center justify-center ${className}`}
    >
      <Image
        src={src}
        alt="CodeSherlock X"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className="drop-shadow-[0_0_16px_rgba(96,165,250,0.18)]"
        style={{
          objectFit: "contain",
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );
}
```

---

## Component: Navbar.tsx

**Location:** `/components/navbar/Navbar.tsx`

```typescript
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center border-b border-white/[0.06] bg-[#080a0f]/80 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <BrandLogo variant="full" size="md" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#8892a4]">
          <a href="#features" className="hover:text-white transition-colors duration-150">
            Features
          </a>
          <a href="#how" className="hover:text-white transition-colors duration-150">
            How it works
          </a>
          <a href="#stats" className="hover:text-white transition-colors duration-150">
            Stats
          </a>
        </nav>
        <Link href="/dashboard" className="btn-primary text-xs px-4 py-2">
          Open Dashboard
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
```

---

## Component: Sidebar.tsx

**Location:** `/components/sidebar/Sidebar.tsx`

```typescript
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

interface SidebarProps {
  expanded?: boolean;
}

export default function Sidebar({ expanded = true }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col items-center gap-8 py-6 px-3 border-r border-white/[0.06] bg-[#080a0f] transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <Link
        href="/dashboard"
        className="hover:opacity-80 transition-opacity"
      >
        <BrandLogo
          variant="icon"
          size={expanded ? "md" : "sm"}
        />
      </Link>

      <nav className="flex flex-col gap-2 w-full">
        {/* Navigation items can be added here */}
      </nav>
    </aside>
  );
}
```

---

## Page: Onboarding Page

**Location:** `/app/onboarding/page.tsx`

```typescript
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
```

---

## Layout Update: layout.tsx

**Location:** `/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeSherlock X — AI Repository Intelligence",
  description:
    "Analyze any GitHub repository with AI. Get architecture insights, PR reviews, auto-generated docs, and technical debt analysis in seconds.",
  keywords: ["AI", "code analysis", "repository", "GitHub", "engineering", "documentation"],
  icons: {
    icon: "/branding/codesherlockx-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/branding/codesherlockx-icon.png" type="image/png" />
        <link rel="shortcut icon" href="/branding/codesherlockx-icon.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## Landing Page Update: page.tsx (Key Changes)

**Location:** `/app/page.tsx` (Imports section)

```typescript
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import BrandLogo from "@/components/ui/BrandLogo";
```

**Footer Section (Updated):**

```typescript
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
```

**Navbar Section (Updated):**

```typescript
{/* ── NAV ── */}
<Navbar />
```

---

## Dashboard Update: dashboard/page.tsx (Key Change)

**Location:** `/app/dashboard/page.tsx` (Imports section)

```typescript
import BrandLogo from "@/components/ui/BrandLogo";
```

**Top Bar Update:**

```typescript
{/* ── TOP BAR ── */}
<header className="h-14 shrink-0 border-b border-white/[0.06] bg-[#080a0f]/95 backdrop-blur-2xl flex items-center px-4 gap-3 z-40">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-2 shrink-0 group hover:opacity-80 transition-opacity">
    <BrandLogo variant="icon" size="sm" />
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
```

---

## Directory Structure After Implementation

```
frontend/
├── public/
│   └── branding/
│       ├── codesherlockx-full-logo.png    ← ADD THIS
│       ├── codesherlockx-icon.png         ← ADD THIS
│       └── .gitkeep
├── components/
│   ├── ui/
│   │   ├── BrandLogo.tsx                  ✅ NEW
│   │   └── Logo.tsx                       (deprecated)
│   ├── navbar/
│   │   └── Navbar.tsx                     ✅ UPDATED
│   └── sidebar/
│       └── Sidebar.tsx                    ✅ UPDATED
├── app/
│   ├── page.tsx                           ✅ UPDATED
│   ├── layout.tsx                         ✅ UPDATED
│   ├── dashboard/
│   │   └── page.tsx                       ✅ UPDATED
│   └── onboarding/
│       └── page.tsx                       ✅ UPDATED
```

---

## All Changes Summary

| Component | Status | Changes |
|-----------|--------|---------|
| BrandLogo.tsx | ✅ NEW | Reusable logo component |
| Navbar.tsx | ✅ UPDATED | Uses BrandLogo (full) |
| Sidebar.tsx | ✅ UPDATED | Uses BrandLogo (icon) |
| page.tsx | ✅ UPDATED | Uses Navbar, footer icon |
| layout.tsx | ✅ UPDATED | Favicon configuration |
| onboarding/page.tsx | ✅ UPDATED | Premium branding |
| dashboard/page.tsx | ✅ UPDATED | Icon logo in top bar |

---

## No Additional Code Needed!

All files are complete and production-ready. Just:

1. ✅ Copy PNG files to `/public/branding/`
2. ✅ Run `npm run dev`
3. ✅ Enjoy your premium branding!
