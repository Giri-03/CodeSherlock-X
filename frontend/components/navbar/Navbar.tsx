import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 flex items-center border-b border-white/[0.06] bg-[#080a0f]/80 backdrop-blur-2xl">
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
