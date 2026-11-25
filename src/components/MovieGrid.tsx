import { useMemo, useState } from 'react';
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
}

export default function MovieGrid({
  title,
  subtitle,
  movies,
  onMovieClick,
  showControls = false,
  action,
}: MovieGridProps) {
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

  return (
    <section className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <span className="rounded-full bg-surface-elevated border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {displayedMovies.length}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
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
                className="inline-flex h-9 items-center justify-between gap-2 rounded-full border border-border bg-surface px-3.5 text-xs font-medium text-foreground hover:bg-surface-hover transition-colors cursor-pointer min-w-[155px]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </SelectTrigger>

              <SelectContent
                sideOffset={6}
                className="z-50 min-w-[175px] overflow-hidden rounded-xl border border-border-strong bg-surface p-1 shadow-xl transition-all duration-150 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95"
              >
                {SORT_ITEMS.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground cursor-pointer transition-colors data-highlighted:bg-surface-elevated hover:bg-surface-elevated"
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

      {/* Optional Genre Filter Strip */}
      {showControls && (
        <div className="mb-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              selectedGenre === null
                ? 'bg-foreground text-background'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover'
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
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-brand text-brand-foreground'
                    : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Responsive Poster Grid */}
      {displayedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3.5 gap-y-6 sm:gap-x-5 sm:gap-y-7">
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => onMovieClick(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            No films match this filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre(null);
              setSortBy('default');
            }}
            className="mt-3 rounded-full border border-border bg-surface-elevated px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}