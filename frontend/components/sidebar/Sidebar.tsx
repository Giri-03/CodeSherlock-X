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
