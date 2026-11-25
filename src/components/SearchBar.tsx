import { useEffect, useState } from 'react';
import {
  Search,
  X,
  Star,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
  Film,
} from 'lucide-react';
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@ui-sdk/react/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui-sdk/react/command';
import { searchMovies } from '../services/api';
import { GENRES } from '../data/fallbackMovies';
import type { Movie } from '../types/movie';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onMovieSelect: (movieId: number) => void;
  onNavigate?: (section: string) => void;
  onGenreSelect?: (genreId: number, genreName: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'inline' | 'trigger';
}

export default function SearchBar({
  onSearch,
  onMovieSelect,
  onNavigate,
  onGenreSelect,
  open: controlledOpen,
  onOpenChange,
  variant = 'trigger',
}: SearchBarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [instantResults, setInstantResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Debounced instant search inside the command palette
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setInstantResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(trimmed);
        if (!cancelled) {
          setInstantResults((res.results ?? []).slice(0, 6));
        }
      } catch {
        if (!cancelled) setInstantResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 240);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleFullSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  return (
    <>
      {variant === 'trigger' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Search movies"
          className="group flex items-center gap-2.5 h-9 px-3 sm:px-3.5 rounded-full border border-border bg-surface-elevated/80 hover:bg-surface-hover text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer w-full sm:w-56 md:w-64 lg:w-72"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="flex-1 text-left truncate">Search films, genres…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      ) : (
        <form onSubmit={handleFullSearchSubmit} className="relative w-full max-w-2xl mx-auto">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search movies, directors, genres..."
            className="w-full h-11 pl-11 pr-20 rounded-full border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface-elevated border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ⌘K
          </button>
        </form>
      )}

      <Dialog open={isOpen} onOpenChange={(next) => setIsOpen(next)}>
        <DialogBackdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <DialogContent
          aria-label="Search movies"
          className="fixed left-1/2 top-[10vh] sm:top-[12vh] z-50 w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95"
        >
          <DialogTitle className="sr-only">Search MovieStream</DialogTitle>

          <Command
            filter={false}
            query={query}
            onQueryChange={(next) => setQuery(next)}
            className="flex flex-col max-h-[75vh]"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              {isSearching ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand" />
              ) : (
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <CommandInput
                aria-label="Search movies"
                placeholder="Search titles, franchises, or genres..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim() && instantResults.length === 0) {
                    handleFullSearchSubmit();
                  }
                }}
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <DialogClose
                aria-label="Close search"
                className="rounded-lg border border-border bg-surface-elevated px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                ESC
              </DialogClose>
            </div>

            {/* Results & Suggestions */}
            <CommandList className="overflow-y-auto p-2 space-y-2">
              {query.trim() ? (
                <>
                  {instantResults.length > 0 ? (
                    <CommandGroup>
                      <CommandGroupLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Instant Matches
                      </CommandGroupLabel>
                      {instantResults.map((movie) => (
                        <CommandItem
                          key={movie.id}
                          value={String(movie.id)}
                          onSelect={() => {
                            onMovieSelect(movie.id);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer text-foreground transition-colors data-highlighted:bg-surface-elevated hover:bg-surface-elevated"
                        >
                          <div className="h-12 w-8 shrink-0 overflow-hidden rounded-md bg-surface-elevated border border-border">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Film className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-sm text-foreground">
                              {movie.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                              <span>
                                {movie.release_date
                                  ? movie.release_date.slice(0, 4)
                                  : 'TBA'}
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 text-gold">
                                <Star className="h-3 w-3 fill-current" />
                                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : !isSearching ? (
                    <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
                      No instant matches for &ldquo;{query}&rdquo;.
                    </CommandEmpty>
                  ) : null}

                  <div className="px-2 pt-1 pb-1">
                    <button
                      type="button"
                      onClick={() => handleFullSearchSubmit()}
                      className="flex w-full items-center justify-between rounded-xl bg-brand/10 hover:bg-brand/15 border border-brand/20 px-4 py-2.5 text-sm font-medium text-brand transition-colors cursor-pointer"
                    >
                      <span>View all results for &ldquo;{query.trim()}&rdquo;</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {onNavigate && (
                    <CommandGroup>
                      <CommandGroupLabel className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Quick Navigation
                      </CommandGroupLabel>
                      {[
                        { id: 'trending', label: 'Trending This Week', icon: Flame },
                        { id: 'top-rated', label: 'Top Rated Cinema', icon: Sparkles },
                        { id: 'watchlist', label: 'My Watchlist', icon: Clock },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => {
                              onNavigate(item.id);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground cursor-pointer transition-colors data-highlighted:bg-surface-elevated hover:bg-surface-elevated"
                          >
                            <Icon className="h-4 w-4 text-brand" />
                            <span>{item.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}

                  <CommandSeparator className="my-1 h-px bg-border" />

                  <div className="px-3 py-2">
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Explore by Genre
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {GENRES.map((genre) => (
                        <button
                          key={genre.id}
                          type="button"
                          onClick={() => {
                            if (onGenreSelect) {
                              onGenreSelect(genre.id, genre.name);
                            } else {
                              onSearch(genre.name);
                            }
                            setIsOpen(false);
                          }}
                          className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-foreground hover:border-brand/50 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CommandList>

            <div className="hidden sm:flex items-center justify-between border-t border-border bg-surface-elevated/50 px-4 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono">↑↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono">↵</kbd> Open
                </span>
              </div>
              <span>Powered by UI SDK</span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}