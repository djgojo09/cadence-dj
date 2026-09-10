import { cn } from "@/lib/utils";

type LogoProps = {
  /** Height of the icon in px; the wordmark scales with it. */
  size?: number;
  /** Use the light wordmark for dark backgrounds. */
  inverted?: boolean;
  /** Hide the "Cadence" text and show only the soundwave mark. */
  iconOnly?: boolean;
  className?: string;
};

const OUTER = "#1F4959";
const CENTER = "#5C7C89";

export function Logo({ size = 32, inverted = false, iconOnly = false, className }: LogoProps) {
  const bars = [
    { x: 2, h: 12 },
    { x: 10, h: 20 },
    { x: 18, h: 32 },
    { x: 26, h: 22 },
    { x: 34, h: 14 },
  ];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={(size * 40) / 32}
        height={size}
        viewBox="0 0 40 32"
        fill="none"
        role="img"
        aria-label="Cadence"
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((bar, i) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={(32 - bar.h) / 2}
            width={4}
            height={bar.h}
            rx={2}
            ry={2}
            fill={i === 2 ? CENTER : inverted ? "#FFFFFF" : OUTER}
          />
        ))}
      </svg>
      {!iconOnly && (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            inverted ? "text-on-dark" : "text-primary",
          )}
          style={{ fontSize: size * 0.62, lineHeight: 1 }}
        >
          Cadence
        </span>
      )}
    </span>
  );
}

export default Logo;
