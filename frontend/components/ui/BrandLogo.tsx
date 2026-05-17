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
