import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  /** Show only the icon (no text below) */
  iconOnly?: boolean;
}

const px: Record<string, number> = { xs: 36, sm: 48, md: 72, lg: 100, xl: 160, full: 240 };

export function Logo({ size = "md", className, iconOnly = false }: LogoProps) {
  const w = px[size];
  // Aspect ratio of full logo is 520:440; icon-only (just the circle area) is square
  const h = iconOnly ? w : Math.round(w * (440 / 520));

  return (
    <svg
      width={w}
      height={h}
      viewBox={iconOnly ? "80 40 360 320" : "0 0 520 440"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      <defs>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600&display=swap');`}</style>

        {/* Gold gradient for LF letters */}
        <linearGradient id="lf-gold-letters" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#EDD880" />
          <stop offset="30%"  stopColor="#C9A84C" />
          <stop offset="70%"  stopColor="#A87828" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>

        {/* Gold for ornaments/text */}
        <linearGradient id="lf-gold-thin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#A87828" />
          <stop offset="50%"  stopColor="#D4B460" />
          <stop offset="100%" stopColor="#A87828" />
        </linearGradient>
      </defs>

      {/* ── Background ─────────────────────────────────────────────── */}
      {!iconOnly && (
        <rect width="520" height="440" fill="#243D22" />
      )}
      {iconOnly && (
        <rect x="80" y="40" width="360" height="320" rx="16" fill="#243D22" />
      )}

      {/* ── Dashed circle ──────────────────────────────────────────── */}
      <circle
        cx="260" cy="200" r="128"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.4"
        strokeDasharray="5 4"
        opacity="0.75"
      />

      {/* ── Diamond ornaments at compass points ────────────────────── */}
      {/* Top */}
      <polygon points="260,60  265.5,70  260,80  254.5,70" fill="#C9A84C" />
      {/* Bottom */}
      <polygon points="260,320 265.5,330 260,340 254.5,330" fill="#C9A84C" />
      {/* Left */}
      <polygon points="120,196 130,201.5 120,207 110,201.5" fill="#C9A84C" />
      {/* Right */}
      <polygon points="400,196 410,201.5 400,207 390,201.5" fill="#C9A84C" />

      {/* Small star/diamond above top ornament */}
      <polygon points="260,42 262.5,48 260,54 257.5,48" fill="#C9A84C" opacity="0.65" />

      {/* ── "LF" letters ───────────────────────────────────────────── */}
      <text
        x="260"
        y="238"
        textAnchor="middle"
        fontFamily="'Cinzel Decorative', 'Trajan Pro', Georgia, serif"
        fontSize="118"
        fontWeight="700"
        fill="url(#lf-gold-letters)"
        letterSpacing="-6"
      >
        LF
      </text>

      {/* ── Bottom section ─────────────────────────────────────────── */}
      {!iconOnly && (
        <>
          {/* Decorative rule: line — diamond — line */}
          <line x1="100" y1="362" x2="244" y2="362" stroke="#C9A84C" strokeWidth="1" opacity="0.7" />
          <polygon points="260,356 265,362 260,368 255,362" fill="#C9A84C" />
          <line x1="276" y1="362" x2="420" y2="362" stroke="#C9A84C" strokeWidth="1" opacity="0.7" />

          {/* Subtitle text */}
          <text
            x="260"
            y="394"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Trajan Pro', Georgia, serif"
            fontSize="13.5"
            fontWeight="400"
            fill="#C9A84C"
            letterSpacing="5"
            opacity="0.9"
          >
            AGENDA · SISTEMA DE GESTÃO
          </text>

          {/* Small diamond below text */}
          <polygon points="260,406 263,412 260,418 257,412" fill="#C9A84C" opacity="0.6" />

          {/* Corner ornaments */}
          <polygon points="28,22  32,28  28,34  24,28" fill="#C9A84C" opacity="0.40" />
          <polygon points="492,22 496,28 492,34 488,28" fill="#C9A84C" opacity="0.40" />
          <polygon points="28,418 32,424 28,430 24,424" fill="#C9A84C" opacity="0.40" />
          <polygon points="492,418 496,424 492,430 488,424" fill="#C9A84C" opacity="0.40" />
        </>
      )}
    </svg>
  );
}
