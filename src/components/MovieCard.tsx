import { Plus, Check, Star, Film, Play } from 'lucide-react';
import { Toggle } from '@ui-sdk/react/toggle';
import { useWatchlist } from '../hooks/useWatchlist';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <article className="group relative flex flex-col">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm transition-all duration-300 group-hover:border-border-strong group-hover:shadow-xl">
        <button
          type="button"
          onClick={onClick}
          aria-label={`Open ${movie.title}`}
          className="block h-full w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-elevated p-4 text-center text-muted-foreground">
              <Film className="h-8 w-8 opacity-40" />
              <span className="text-xs font-medium line-clamp-2">{movie.title}</span>
            </div>
          )}

          {/* Subtle hover overlay with play cue */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg scale-90 transition-transform duration-300 group-hover:scale-100">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </span>
          </div>
        </button>

        {/* Rating Badge (Top Left) */}
        {movie.vote_average > 0 && (
          <div className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-300 backdrop-blur-md border border-white/10">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Watchlist Toggle (Top Right — always accessible on touch & desktop) */}
        <Toggle
          pressed={inWatchlist}
          onPressedChange={() => toggleWatchlist(movie)}
          onClick={(e) => e.stopPropagation()}
          aria-label={
            inWatchlist
              ? `Remove ${movie.title} from watchlist`
              : `Add ${movie.title} to watchlist`
          }
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/15 transition-all hover:bg-black/90 cursor-pointer data-pressed:bg-brand data-pressed:border-brand data-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {inWatchlist ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Toggle>
      </div>

      {/* Metadata Below Poster (always readable on mobile & desktop) */}
      <button
        type="button"
        onClick={onClick}
        className="mt-2.5 text-left cursor-pointer focus:outline-none"
      >
        <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-1 group-hover:text-brand transition-colors">
          {movie.title}
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>{year ?? 'TBA'}</span>
          {movie.vote_average > 0 && (
            <>
              <span>·</span>
              <span className="text-gold">{movie.vote_average.toFixed(1)}</span>
            </>
          )}
        </div>
      </button>
    </article>
  );
}