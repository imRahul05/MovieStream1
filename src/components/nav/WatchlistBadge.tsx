interface WatchlistBadgeProps {
  count: number;
  className?: string;
}

/** Count pill that pops (spring) every time the number changes. */
export default function WatchlistBadge({ count, className = '' }: WatchlistBadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      key={count}
      aria-label={`${count} in watchlist`}
      className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1.5 font-mono text-[10px] font-bold leading-none text-brand-foreground animate-pop ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
