import { useCallback, useEffect, useState } from 'react';
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
import { SHORTCUT_LABEL } from './nav/navItems';

const ROW_ANIM = 'animate-[fade-up_420ms_var(--ease-out-expo)_both]';
const ROW_BASE =
  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground cursor-pointer transition-colors duration-150 data-highlighted:bg-surface-elevated before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:origin-center before:scale-y-0 before:rounded-sm before:bg-brand before:transition-transform before:duration-300 before:ease-(--ease-out-expo) data-highlighted:before:scale-y-100';
const GROUP_LABEL =
  'px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';
const delay = (i: number) => ({ animationDelay: `${i * 45}ms` });

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
  const setIsOpen = useCallback(
    (next: boolean) => {
      setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

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
  }, [isOpen, setIsOpen]);

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
          aria-keyshortcuts="Control+K Meta+K"
          className="group hidden h-9 w-full items-center sm:flex gap-2.5 rounded-sm border border-border bg-surface-elevated/70 px-3 text-sm text-muted-foreground transition-all duration-300 hover:border-border-strong hover:bg-surface-hover hover:text-foreground cursor-pointer sm:w-44 md:w-52 xl:w-72 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Search className="h-4 w-4 shrink-0 transition-transform duration-300 ease-(--ease-spring) group-hover:scale-110 group-hover:text-brand" aria-hidden="true" />
          <span className="flex-1 truncate text-left">Search films&hellip;</span>
          <kbd className="hidden items-center rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
            {SHORTCUT_LABEL}
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
            className="w-full h-11 pl-11 pr-20 rounded-sm border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm bg-surface-elevated border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {SHORTCUT_LABEL}
          </button>
        </form>
      )}

      <Dialog open={isOpen} onOpenChange={(next) => setIsOpen(next)}>
        <DialogBackdrop className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <DialogContent
          aria-label="Search movies"
          className="fixed left-1/2 top-[10vh] sm:top-[12vh] z-50 w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_var(--border)] transition-[opacity,scale,filter] duration-300 ease-(--ease-out-expo) data-starting-style:opacity-0 data-starting-style:scale-95 data-starting-style:blur-md data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:blur-md motion-reduce:transition-none"
        >
          <DialogTitle className="sr-only">Search MovieStream</DialogTitle>

          <Command
            filter={false}
            query={query}
            onQueryChange={(next) => setQuery(next)}
            className="flex flex-col max-h-[75vh]"
          >
            {/* Search Input Header */}
            <div className="relative flex items-center gap-3 border-b border-border px-4 py-3.5">
              {isSearching ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand" aria-hidden="true" />
              ) : (
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
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
                className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <DialogClose
                aria-label="Close search"
                className="rounded-lg border border-border bg-surface-elevated px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
              >
                ESC
              </DialogClose>

              {/* Accent scan line while searching */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden transition-opacity duration-300 ${
                  isSearching ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="block h-full w-1/3 animate-scan bg-linear-to-r from-transparent via-brand to-transparent" />
              </span>
            </div>

            {/* Results & Suggestions */}
            <CommandList className="space-y-2 overflow-y-auto p-2">
              {query.trim() ? (
                <>
                  {instantResults.length > 0 ? (
                    <CommandGroup
                      className={`transition-opacity duration-200 ${isSearching ? 'opacity-60' : 'opacity-100'}`}
                    >
                      <CommandGroupLabel className={GROUP_LABEL}>
                        Instant Matches
                      </CommandGroupLabel>
                      {instantResults.map((movie, i) => (
                        <CommandItem
                          key={movie.id}
                          value={String(movie.id)}
                          onSelect={() => {
                            onMovieSelect(movie.id);
                            setIsOpen(false);
                          }}
                          style={delay(i)}
                          className={`${ROW_BASE} ${ROW_ANIM}`}
                        >
                          <div className="h-12 w-8 shrink-0 overflow-hidden rounded-md border border-border bg-surface-elevated">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <Film className="h-4 w-4" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {movie.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                              <span>
                                {movie.release_date
                                  ? movie.release_date.slice(0, 4)
                                  : 'TBA'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 text-gold">
                                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-data-highlighted:translate-x-0 group-data-highlighted:opacity-100" aria-hidden="true" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : isSearching ? (
                    <div className="space-y-1 px-1 py-1" role="status" aria-label="Searching">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
                          <div className="skeleton h-12 w-8 shrink-0 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <div className="skeleton h-3.5 rounded" style={{ width: `${70 - i * 12}%` }} />
                            <div className="skeleton h-3 w-1/4 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <CommandEmpty className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground animate-fade-up">
                      <Search className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                      <span>No instant matches for &ldquo;{query}&rdquo;.</span>
                    </CommandEmpty>
                  )}

                  <div className="px-1 pb-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFullSearchSubmit()}
                      className="group flex w-full items-center justify-between rounded-xl border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:border-brand/60 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      <span className="truncate">View all results for &ldquo;{query.trim()}&rdquo;</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {onNavigate && (
                    <CommandGroup>
                      <CommandGroupLabel className={GROUP_LABEL}>
                        Quick Navigation
                      </CommandGroupLabel>
                      {[
                        { id: 'trending', label: 'Trending This Week', icon: Flame },
                        { id: 'top-rated', label: 'Top Rated Cinema', icon: Sparkles },
                        { id: 'watchlist', label: 'My Watchlist', icon: Clock },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => {
                              onNavigate(item.id);
                              setIsOpen(false);
                            }}
                            style={delay(i)}
                            className={`${ROW_BASE} ${ROW_ANIM} text-sm`}
                          >
                            <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
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
                      {GENRES.map((genre, i) => (
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
                          style={{ animationDelay: `${150 + i * 25}ms` }}
                          className="animate-[scale-in_380ms_var(--ease-out-expo)_both] rounded-sm border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand-soft hover:text-brand cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CommandList>

            <div className="hidden items-center justify-between border-t border-border bg-surface-elevated/50 px-4 py-2 text-[11px] text-muted-foreground sm:flex">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono">↑↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono">↵</kbd> Open
                </span>
                <span>
                  <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono">esc</kbd> Close
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5">
                <span className="blip-dot" aria-hidden="true" />
                Live search
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}