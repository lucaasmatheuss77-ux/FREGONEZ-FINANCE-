import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { xs: 28, sm: 36, md: 48, lg: 64, xl: 96 };

export function Logo({ size = "md", className }: LogoProps) {
  const px = sizes[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      <defs>
        <linearGradient id="lfa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0E1E0E" />
          <stop offset="100%" stopColor="#1A2E1A" />
        </linearGradient>
        <linearGradient id="lfa-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8CC68" />
          <stop offset="50%" stopColor="#B8882A" />
          <stop offset="100%" stopColor="#D4A84B" />
        </linearGradient>
        <linearGradient id="lfa-rule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(176,125,16,0)" />
          <stop offset="30%" stopColor="#B8882A" />
          <stop offset="70%" stopColor="#E8C870" />
          <stop offset="100%" stopColor="rgba(176,125,16,0)" />
        </linearGradient>
        <filter id="lfa-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="120" height="120" rx="26" fill="url(#lfa-bg)" />

      {/* Inner border glow */}
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none"
        stroke="rgba(176,125,16,0.25)" strokeWidth="1" />

      {/* Top rule */}
      <rect x="18" y="21" width="84" height="1.5" rx="0.75" fill="url(#lfa-rule)" />

      {/* LFA lettering — serif, tight kerning */}
      <text
        x="60" y="80"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="56"
        fontWeight="700"
        fill="url(#lfa-gold)"
        filter="url(#lfa-glow)"
        letterSpacing="-1"
      >
        LFA
      </text>

      {/* Bottom rule */}
      <rect x="18" y="97" width="84" height="1.5" rx="0.75" fill="url(#lfa-rule)" />

      {/* Corner marks */}
      <rect x="10" y="10" width="10" height="1.5" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="10" y="10" width="1.5" height="10" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="100" y="10" width="10" height="1.5" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="108.5" y="10" width="1.5" height="10" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="10" y="108.5" width="10" height="1.5" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="10" y="100" width="1.5" height="10" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="100" y="108.5" width="10" height="1.5" rx="0.75" fill="#B8882A" opacity="0.55" />
      <rect x="108.5" y="100" width="1.5" height="10" rx="0.75" fill="#B8882A" opacity="0.55" />
    </svg>
  );
}
