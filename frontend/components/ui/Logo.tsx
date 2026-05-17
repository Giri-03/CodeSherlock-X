interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

// Shield + S circuit icon — matches the CodeSherlock X brand image
function ShieldIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="shieldEdge" x1="0" y1="0" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="sGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shield body */}
      <path
        d="M20 2L4 8v12c0 9.5 6.8 18.4 16 21 9.2-2.6 16-11.5 16-21V8L20 2z"
        fill="url(#shieldGrad)"
        opacity="0.95"
      />

      {/* Shield border highlight */}
      <path
        d="M20 2L4 8v12c0 9.5 6.8 18.4 16 21 9.2-2.6 16-11.5 16-21V8L20 2z"
        fill="none"
        stroke="url(#shieldEdge)"
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* Inner circle */}
      <circle cx="20" cy="20" r="10" fill="none" stroke="url(#shieldEdge)" strokeWidth="1" opacity="0.5" />

      {/* Circuit dots on circle */}
      <circle cx="20" cy="10" r="1.2" fill="#a78bfa" opacity="0.8" />
      <circle cx="30" cy="20" r="1.2" fill="#60a5fa" opacity="0.8" />
      <circle cx="20" cy="30" r="1.2" fill="#a78bfa" opacity="0.8" />
      <circle cx="10" cy="20" r="1.2" fill="#60a5fa" opacity="0.8" />

      {/* S letter — circuit style */}
      <g filter="url(#glow)">
        <path
          d="M23.5 15.5c0-1.4-1.2-2.5-3.5-2.5s-3.5 1.1-3.5 2.5c0 1.2.8 2 2.5 2.5l2 .6c1.8.5 2.5 1.4 2.5 2.6 0 1.5-1.3 2.8-3.5 2.8s-3.5-1.3-3.5-2.8"
          stroke="url(#sGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Circuit nodes on S */}
        <circle cx="20" cy="13" r="1" fill="#c4b5fd" />
        <circle cx="20" cy="27" r="1" fill="#93c5fd" />
      </g>

      {/* Side arrows / chevrons */}
      <path d="M5 18l-2.5 2 2.5 2" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M35 18l2.5 2-2.5 2" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />

      {/* Magnifier handle hint at bottom */}
      <line x1="20" y1="38" x2="22" y2="41" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 40 : 28;
  const textClass = size === "sm"
    ? "text-sm"
    : size === "lg"
    ? "text-2xl"
    : "text-base";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <ShieldIcon size={iconSize} />
      {showText && (
        <span className={`font-bold tracking-tight leading-none ${textClass}`}>
          <span
            style={{
              background: "linear-gradient(135deg, #c4b5fd 0%, #818cf8 40%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CodeSherlock
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {" X"}
          </span>
        </span>
      )}
    </div>
  );
}
