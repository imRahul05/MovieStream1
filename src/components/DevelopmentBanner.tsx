import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SHORTCUT_LABEL } from './nav/navItems';

interface DevelopmentBannerProps {
  message?: string;
  duration?: number;
}

const EXIT_MS = 300;

const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({
  message = `Tip: press ${SHORTCUT_LABEL} anytime for instant movie & genre search.`,
  duration = 9000,
}) => {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    setPhase((p) => (p === 'in' ? 'out' : p));
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setPhase('gone'), EXIT_MS);
  };

  useEffect(() => {
    const auto = setTimeout(() => {
      setPhase((p) => (p === 'in' ? 'out' : p));
      exitTimer.current = setTimeout(() => setPhase('gone'), EXIT_MS);
    }, duration);
    return () => {
      clearTimeout(auto);
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [duration]);

  if (phase === 'gone') return null;

  return (
    <div
      role="status"
      className={`fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 overflow-hidden rounded-3xl md:rounded-full border border-border-strong bg-glass text-xs text-foreground shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ease-(--ease-out-expo) md:inset-x-auto md:bottom-5 md:right-6 md:max-w-sm ${
        phase === 'out'
          ? 'translate-y-3 opacity-0'
          : 'animate-[fade-up_600ms_var(--ease-out-expo)_both] [animation-delay:600ms]'
      }`}
    >
      <div className="flex items-center gap-3 py-2 pl-4 pr-2">
        <span className="blip-dot shrink-0" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-snug text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss tip"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-5 bottom-0 h-px origin-left bg-brand animate-progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default DevelopmentBanner;
