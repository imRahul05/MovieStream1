import { Play, Star, Clock, Bookmark, Check, X, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toggle } from '@ui-sdk/react/toggle';
import type { Movie, MovieDetails } from '../types/movie';
import { fetchMovieDetails } from '../services/api';
import { useWatchlist } from '../hooks/useWatchlist';

interface FeaturedMovieProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

export default function FeaturedMovie({ movies, onMovieClick }: FeaturedMovieProps) {
  const featuredPool = movies.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const activeBase = featuredPool[activeIndex] ?? movies[0];

  useEffect(() => {
    if (!activeBase) return;
    let cancelled = false;
    setIsPlaying(false);

    const loadMovie = async () => {
      try {
        const details = await fetchMovieDetails(String(activeBase.id));
        if (!cancelled) setMovie(details);
      } catch (error) {
        console.error('Failed to load featured movie:', error);
      }
    };
    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [activeBase?.id]);

  if (!activeBase) return null;

  const displayTitle = movie?.title ?? activeBase.title;
  const displayOverview = movie?.overview ?? activeBase.overview;
  const displayBackdrop = movie?.backdrop_path ?? activeBase.backdrop_path;
  const displayRating = movie?.vote_average ?? activeBase.vote_average;
  const displayYear = (movie?.release_date ?? activeBase.release_date)?.slice(0, 4);
  const inWatchlist = isInWatchlist(activeBase.id);

  const trailer = movie?.videos?.results?.find(
    (video) =>
      (video.type === 'Trailer' || video.type === 'Teaser') &&
      video.site === 'YouTube'
  );

  return (
    <section
      aria-label="Featured cinema"
      className="relative w-full overflow-hidden bg-black min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] xl:min-h-[680px] flex items-end border-b border-border"
    >
      {/* Backdrop or Embedded Trailer */}
      {isPlaying && trailer ? (
        <div className="absolute inset-0 z-10 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={`${displayTitle} trailer`}
            className="h-full w-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            aria-label="Close trailer"
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/15 hover:bg-black transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span>Close Trailer</span>
          </button>
        </div>
      ) : (
        <>
          {displayBackdrop ? (
            <img
              src={`https://image.tmdb.org/t/p/original${displayBackdrop}`}
              alt={displayTitle}
              className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          {/* Multi-stop cinematic scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </>
      )}

      {/* Content Overlay aligned with main container */}
      {!isPlaying && (
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pb-12 lg:pb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Metadata row */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-white/85">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 font-mono font-semibold text-amber-300 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {displayRating ? displayRating.toFixed(1) : 'N/A'}
              </span>
              {displayYear && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-white/90 backdrop-blur-sm">
                  {displayYear}
                </span>
              )}
              {movie?.runtime ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-white/90 backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              ) : null}
              {movie?.genres?.slice(0, 3).map((g) => (
                <span
                  key={g.id}
                  className="hidden sm:inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-white/85 backdrop-blur-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Hero Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08] mb-3">
              {displayTitle}
            </h1>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-white/80 leading-relaxed line-clamp-3 sm:line-clamp-2 mb-6 max-w-xl">
              {displayOverview}
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onMovieClick(activeBase.id)}
                className="inline-flex items-center gap-2 rounded-full bg-brand hover:bg-brand-hover px-5 sm:px-7 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Watch Now</span>
              </button>

              {trailer && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Film className="h-4 w-4" />
                  <span>Trailer</span>
                </button>
              )}

              <Toggle
                pressed={inWatchlist}
                onPressedChange={() => toggleWatchlist(activeBase)}
                aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors cursor-pointer data-pressed:bg-white data-pressed:text-black data-pressed:border-white"
              >
                {inWatchlist ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Watchlist</span>
                  </>
                )}
              </Toggle>
            </div>
          </div>

          {/* Featured Switcher Thumbnails */}
          {featuredPool.length > 1 && (
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1"
              role="tablist"
              aria-label="Featured titles"
            >
              {featuredPool.map((item, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Feature ${item.title}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-12 w-20 sm:h-14 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand scale-105 shadow-lg'
                        : 'border-white/20 opacity-65 hover:opacity-100'
                    }`}
                  >
                    {item.backdrop_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-800" />
                    )}
                    <div className="absolute inset-0 bg-black/25" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}