import { useState } from 'react';
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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const inWatchlist = isInWatchlist(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const showImage = Boolean(movie.poster_path) && !failed;

  return (
    <article className="group relative flex flex-col transition-transform duration-500 ease-(--ease-out-expo) hover:-translate-y-1.5">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm transition-[box-shadow,border-color] duration-500 group-hover:border-brand/60 group-hover:shadow-[0_18px_40px_-12px_var(--brand-glow)] group-focus-within:border-brand/60">
        {/* Skeleton / fallback underlay */}
        {(!showImage || !loaded) && (
          <div
            className={`absolute inset-0 ${showImage ? 'skeleton' : 'bg-surface-elevated'}`}
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          onClick={onClick}
          aria-label={`Open ${movie.title}`}
          className="shine absolute inset-0 block h-full w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand rounded-2xl"
        >
          {showImage ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt=""
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`h-full w-full object-cover transition-[opacity,filter,transform] duration-700 ease-(--ease-out-expo) group-hover:scale-[1.06] ${
                loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg scale-105'
              }`}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-muted-foreground">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface">
                <Film className="h-5 w-5 text-brand" />
              </span>
              <span className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-3">
                {movie.title}
              </span>
            </div>
          )}

          {/* Hover scrim + play */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="flex h-12 w-12 scale-50 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand-glow transition-transform duration-500 ease-(--ease-spring) group-hover:scale-100 group-focus-within:scale-100">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </div>
        </button>

        {/* Rating chip */}
        {movie.vote_average > 0 && (
          <div className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface/90 px-2 py-1 font-mono text-[11px] font-semibold leading-none text-gold backdrop-blur-md">
            <Star className="h-2.5 w-2.5 fill-current" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Watchlist toggle — 40px hit target */}
        <Toggle
          pressed={inWatchlist}
          onPressedChange={() => toggleWatchlist(movie)}
          onClick={(e) => e.stopPropagation()}
          aria-label={
            inWatchlist
              ? `Remove ${movie.title} from watchlist`
              : `Add ${movie.title} to watchlist`
          }
          className="group/wl absolute right-1 top-1 inline-flex h-10 w-10 items-center justify-center rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand"
        >
          <span
            key={String(inWatchlist)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-white backdrop-blur-md transition-colors group-hover/wl:bg-black/90 ${
              inWatchlist
                ? 'animate-pop border-brand bg-brand text-brand-foreground'
                : 'border-white/20 bg-black/70'
            }`}
          >
            {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </span>
        </Toggle>
      </div>

      {/* Meta */}
      <button
        type="button"
        onClick={onClick}
        tabIndex={-1}
        aria-hidden="true"
        className="mt-3 min-h-10 text-left cursor-pointer focus:outline-none"
      >
        <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-1 transition-colors group-hover:text-brand">
          {movie.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>{year ?? 'TBA'}</span>
          {movie.vote_average > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-0.5 text-gold">
                <Star className="h-2.5 w-2.5 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
            </>
          )}
        </div>
      </button>
    </article>
  );
}
