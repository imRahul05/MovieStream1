import { useMemo, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from '@ui-sdk/react/select';
import MovieCard from './MovieCard';
import { GENRES } from '../data/fallbackMovies';
import type { Movie } from '../types/movie';

type SortOption = 'default' | 'rating' | 'newest' | 'title';

const SORT_ITEMS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured Order' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title', label: 'Title A–Z' },
];

interface MovieGridProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
  showControls?: boolean;
  action?: React.ReactNode;
  /** Render as a horizontal snap-scroll rail on phones (grid from sm up). */
  rail?: boolean;
}

export default function MovieGrid({
  title,
  subtitle,
  movies,
  onMovieClick,
  showControls = false,
  action,
  rail = false,
}: MovieGridProps) {
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>({ threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const displayedMovies = useMemo(() => {
    let list = [...movies];

    if (selectedGenre !== null) {
      list = list.filter((m) => m.genre_ids?.includes(selectedGenre));
    }

    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
        break;
      case 'newest':
        list.sort((a, b) =>
          (b.release_date ?? '').localeCompare(a.release_date ?? '')
        );
        break;
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [movies, sortBy, selectedGenre]);

  const chipBase =
    'shrink-0 min-h-9 rounded-sm px-4 py-1.5 text-xs font-medium transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
  const chipIdle =
    'border border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground hover:bg-surface-hover';

  return (
    <section className="py-6 sm:py-8">
      {/* Section Header */}
      <div
        ref={headerRef}
        className="reveal mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="blip-dot" aria-hidden="true" />
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <span className="rounded-sm border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              {displayedMovies.length}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1.5 pl-5 text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div
            className="mt-3 ml-5 h-px w-24 bg-gradient-to-r from-brand to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center gap-3">
          {showControls && (
            <Select
              value={sortBy}
              onValueChange={(next) => {
                if (next) setSortBy(next as SortOption);
              }}
              items={SORT_ITEMS}
            >
              <SelectTrigger
                aria-label="Sort movies"
                className="inline-flex h-10 min-w-[170px] cursor-pointer items-center justify-between gap-2 rounded-sm border border-border-strong bg-surface px-4 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-brand" />
                  <SelectValue />
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </SelectTrigger>

              <SelectContent
                sideOffset={6}
                className="z-50 min-w-[190px] overflow-hidden rounded-2xl border border-border-strong bg-surface p-1.5 shadow-2xl transition-all duration-200 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
              >
                {SORT_ITEMS.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-elevated data-highlighted:bg-surface-elevated"
                  >
                    <span>{item.label}</span>
                    <SelectItemIndicator className="text-brand">
                      <Check className="h-3.5 w-3.5" />
                    </SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {action}
        </div>
      </div>

      {/* Genre filter strip */}
      {showControls && (
        <div
          className="no-scrollbar -mx-4 mb-6 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
          role="group"
          aria-label="Filter by genre"
        >
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            aria-pressed={selectedGenre === null}
            className={`${chipBase} ${
              selectedGenre === null ? 'bg-foreground text-background' : chipIdle
            }`}
          >
            All Genres
          </button>
          {GENRES.map((genre) => {
            const active = selectedGenre === genre.id;
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => setSelectedGenre(active ? null : genre.id)}
                aria-pressed={active}
                className={`${chipBase} ${
                  active ? 'bg-brand text-brand-foreground shadow-md shadow-brand-glow' : chipIdle
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Poster grid / mobile rail */}
      <div ref={gridRef} className="group/grid">
        {displayedMovies.length > 0 ? (
          <div
            className={
              rail
                ? 'stagger no-scrollbar -mx-4 -my-3 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-4 px-4 py-3 sm:mx-0 sm:my-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:p-0 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'stagger grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            }
          >
            {displayedMovies.map((movie, idx) => (
              <div
                key={movie.id}
                style={{ '--i': Math.min(idx, 14) } as React.CSSProperties}
                className={`opacity-0 group-[.is-visible]/grid:animate-fade-up ${
                  rail ? 'w-[42%] min-w-[150px] shrink-0 snap-start sm:w-auto sm:min-w-0' : ''
                }`}
              >
                <MovieCard movie={movie} onClick={() => onMovieClick(movie.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-scale-in rounded-3xl border border-dashed border-border-strong bg-surface p-10 text-center">
            <p className="font-display text-base font-semibold text-foreground">
              No films match this filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedGenre(null);
                setSortBy('default');
              }}
              className="mt-4 min-h-10 cursor-pointer rounded-sm bg-brand px-5 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
