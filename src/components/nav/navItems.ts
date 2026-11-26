import { Home, Flame, Star, Bookmark } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'top-rated', label: 'Top Rated', icon: Star },
  { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
] as const;

export const PORTFOLIO_URL = 'https://imrahul05.vercel.app';

/** Shared focus ring used across navigation controls. */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

const isApplePlatform =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

/** Platform-aware search shortcut label. */
export const SHORTCUT_LABEL = isApplePlatform ? '⌘K' : 'Ctrl K';
