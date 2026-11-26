import { useEffect, useState } from 'react';

interface RatingRingProps {
  /** Score from 0 to 10 */
  value: number;
  size?: number;
}

/** Animated circular meter that fills to `value / 10` using the accent. */
export default function RatingRing({ value, size = 64 }: RatingRingProps) {
  const [go, setGo] = useState(false);
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 10));

  useEffect(() => {
    const id = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 10`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={go ? c * (1 - pct) : c}
          style={{
            transition: 'stroke-dashoffset 1400ms var(--ease-out-expo) 250ms',
            filter: 'drop-shadow(0 0 6px var(--brand-glow))',
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-extrabold text-foreground tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
