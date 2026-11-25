import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface DevelopmentBannerProps {
  message?: string;
  duration?: number;
}

const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({
  message = 'Tip: Press ⌘K anytime for instant movie & genre search.',
  duration = 9000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-18 right-4 lg:bottom-5 lg:right-6 z-30 max-w-xs sm:max-w-sm rounded-2xl border border-border-strong bg-surface/95 px-4 py-3 text-xs text-foreground shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-brand" />
        <p className="flex-1 leading-snug text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss tip"
          className="rounded-full p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DevelopmentBanner;