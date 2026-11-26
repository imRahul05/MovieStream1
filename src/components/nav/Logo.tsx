import { Film } from 'lucide-react';
import { FOCUS_RING } from './navItems';

interface LogoProps {
  onClick?: () => void;
  /** Hide the wordmark text (mark only). */
  markOnly?: boolean;
}

/** Brand mark with a subtle accent blip. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand-glow)] transition-transform duration-500 ease-(--ease-spring) group-hover:-rotate-6 group-hover:scale-110 ${className}`}
    >
      <Film className="h-4 w-4" aria-hidden="true" />
      <span
        className="blip-dot absolute -right-0.5 -top-0.5 !h-2 !w-2 border-2 border-background !bg-brand"
        aria-hidden="true"
      />
    </span>
  );
}

export default function Logo({ onClick, markOnly = false }: LogoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="MovieStream home"
      className={`group flex items-center gap-2.5 rounded-lg cursor-pointer ${FOCUS_RING}`}
    >
      <LogoMark />
      {!markOnly && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          Movie<span className="text-brand">Stream</span>
        </span>
      )}
    </button>
  );
}
