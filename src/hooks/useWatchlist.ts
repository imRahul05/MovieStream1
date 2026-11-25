import { useSyncExternalStore } from 'react';
import type { Movie } from '../types/movie';

const STORAGE_KEY = 'watchlist';

let cachedWatchlist: Movie[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Movie[]) : [];
  } catch {
    return [];
  }
})();

const listeners = new Set<() => void>();

function emitChange() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedWatchlist));
  } catch {
    // Ignore storage quota errors
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedWatchlist;
}

export const useWatchlist = () => {
  const watchlist = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addToWatchlist = (movie: Movie) => {
    if (cachedWatchlist.some((m) => m.id === movie.id)) return;
    cachedWatchlist = [movie, ...cachedWatchlist];
    emitChange();
  };

  const removeFromWatchlist = (movieId: number) => {
    cachedWatchlist = cachedWatchlist.filter((m) => m.id !== movieId);
    emitChange();
  };

  const toggleWatchlist = (movie: Movie) => {
    if (cachedWatchlist.some((m) => m.id === movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  };
};