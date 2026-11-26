import { Play, Star, Clock, Bookmark, Check, X, Film, Flame } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Toggle } from '@ui-sdk/react/toggle';
import type { Movie, MovieDetails } from '../types/movie';
import { fetchMovieDetails } from '../services/api';
import { useWatchlist } from '../hooks/useWatchlist';

interface FeaturedMovieProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

/** Time each slide stays on screen before auto-advancing. */
const SLIDE_MS = 8000;
const SWIPE_THRESHOLD = 48;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Thumb({ path }: { path: string | null | undefined }) {
  const [failed, setFailed] = useState(false);
  if (!path || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-white/60">
        <Film className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }
  return (
    <img
      src={`https://image.tmdb.org/t/p/w300${path}`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover/t:scale-110"
    />
  );
}

function Backdrop({ movie, animate }: { movie: Movie; animate: boolean }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(movie.backdrop_path) && !failed;
  return (
    <div className={`absolute inset-0 overflow-hidden ${animate ? 'animate-blur-in' : ''}`}>
      {hasImage ? (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full animate-ken-burns object-cover object-center"
        />
      ) : (
        <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_70%_20%,var(--brand-glow),transparent_60%),linear-gradient(160deg,#16161d,#050507)]">
          <Film
            className="absolute right-[8%] top-[18%] h-40 w-40 animate-float text-white/[0.06] sm:h-64 sm:w-64"
            strokeWidth={0.75}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

export default function FeaturedMovie({ movies, onMovieClick }: FeaturedMovieProps) {
  const featuredPool = movies.slice(0, 4);
  const count = featuredPool.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const activeBase = featuredPool[activeIndex] ?? movies[0];
  const movie = details && details.id === activeBase?.id ? details : null;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const target = ((next % count) + count) % count;
      setActiveIndex((cur) => {
        if (cur === target) return cur;
        setPrevIndex(cur);
        return target;
      });
    },
    [count]
  );

  // Drop the outgoing backdrop layer once the crossfade has finished.
  useEffect(() => {
    if (prevIndex === null) return;
    const t = window.setTimeout(() => setPrevIndex(null), 1100);
    return () => window.clearTimeout(t);
  }, [prevIndex]);

  const activeId = activeBase?.id;
  useEffect(() => {
    if (activeId === undefined) return;
    let cancelled = false;
    setIsPlaying(false);

    const loadMovie = async () => {
      try {
        const d = await fetchMovieDetails(String(activeId));
        if (!cancelled) setDetails(d);
      } catch (error) {
        console.error('Failed to load featured movie:', error);
      }
    };
    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  if (!activeBase) return null;

  const displayTitle = movie?.title ?? activeBase.title;
  const displayOverview = movie?.overview ?? activeBase.overview;
  const displayRating = movie?.vote_average ?? activeBase.vote_average;
  const displayYear = (movie?.release_date ?? activeBase.release_date)?.slice(0, 4);
  const inWatchlist = isInWatchlist(activeBase.id);
  const paused = hovered || focused || isPlaying;
  const autoAdvance = count > 1 && !reduced;
  const prevBase = prevIndex !== null ? featuredPool[prevIndex] : undefined;

  const trailer = movie?.videos?.results?.find(
    (video) =>
      (video.type === 'Trailer' || video.type === 'Teaser') &&
      video.site === 'YouTube'
  );

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(activeIndex + (dx < 0 ? 1 : -1));
    }
  };

  const progressBar = (idx: number) => {
    const done = idx < activeIndex;
    const current = idx === activeIndex;
    return (
      <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/25">
        <span
          key={current ? `${activeBase.id}-${activeIndex}` : idx}
          onAnimationEnd={() => {
            if (current && autoAdvance) goTo(idx + 1);
          }}
          className={`block h-full origin-left rounded-full bg-brand ${
            current && autoAdvance ? 'animate-progress' : ''
          } ${done || (current && !autoAdvance) ? 'scale-x-100' : ''} ${
            !current && !done ? 'scale-x-0' : ''
          }`}
          style={
            current && autoAdvance
              ? {
                  animationDuration: `${SLIDE_MS}ms`,
                  animationPlayState: paused ? 'paused' : 'running',
                }
              : undefined
          }
        />
      </span>
    );
  };

  return (
    <section
      aria-label="Featured cinema"
      aria-roledescription="carousel"
      className="grain relative isolate flex h-[clamp(540px,86svh,780px)] w-full items-end overflow-hidden border-b border-border bg-black lg:h-[clamp(580px,80svh,820px)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {isPlaying && trailer ? (
        <div className="absolute inset-0 z-30 animate-fade-in bg-black">
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
            className="absolute right-4 top-4 z-40 inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-4 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:right-6 sm:top-6"
          >
            <X className="h-4 w-4" />
            <span>Close Trailer</span>
          </button>
        </div>
      ) : (
        <>
          {/* Backdrops: outgoing slide stays underneath while the new one blurs in */}
          {prevBase && <Backdrop key={`prev-${prevBase.id}`} movie={prevBase} animate={false} />}
          <Backdrop key={activeBase.id} movie={activeBase} animate={prevBase !== undefined} />

          {/* Scrims: guarantee legible text on any image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" aria-hidden="true" />
          {/* Accent scan beam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden" aria-hidden="true">
            <div className="h-full w-1/3 animate-scan bg-gradient-to-r from-transparent via-brand to-transparent" />
          </div>
        </>
      )}

      {!isPlaying && (
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-end justify-between gap-10 px-4 pb-6 pt-24 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
          {/* Text column (re-keyed per slide so the stagger replays) */}
          <div className="min-w-0 max-w-2xl flex-1" aria-live="polite">
            <div key={activeBase.id} className="stagger">
              <div
                style={{ '--i': 0 } as React.CSSProperties}
                className="mb-4 flex items-center gap-3 animate-fade-up"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <span className="blip-dot" aria-hidden="true" />
                  Now trending
                  <Flame className="h-3 w-3 text-brand" aria-hidden="true" />
                </span>
                {count > 1 && (
                  <span className="font-mono text-xs tabular-nums text-white/70">
                    {String(activeIndex + 1).padStart(2, '0')}
                    <span className="text-white/40"> / {String(count).padStart(2, '0')}</span>
                  </span>
                )}
              </div>

              <h1
                style={{ '--i': 1 } as React.CSSProperties}
                className="animate-fade-up font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                {displayTitle}
              </h1>

              <div
                style={{ '--i': 2 } as React.CSSProperties}
                className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-white animate-fade-up"
              >
                {displayRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 font-mono font-semibold backdrop-blur-md">
                    <Star className="h-3 w-3 fill-current text-gold" aria-hidden="true" />
                    {displayRating.toFixed(1)}
                  </span>
                )}
                {displayYear && (
                  <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 font-mono backdrop-blur-md">
                    {displayYear}
                  </span>
                )}
                {movie?.runtime ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 font-mono backdrop-blur-md">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                ) : null}
                {movie?.genres?.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="hidden rounded-full border border-white/20 bg-black/55 px-2.5 py-1 backdrop-blur-md sm:inline-flex"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p
                style={{ '--i': 3 } as React.CSSProperties}
                className="mt-4 max-w-xl animate-fade-up text-sm leading-relaxed text-white/90 line-clamp-3 sm:text-base"
              >
                {displayOverview}
              </p>

              <div
                style={{ '--i': 4 } as React.CSSProperties}
                className="mt-6 flex flex-wrap items-center gap-2.5 animate-fade-up sm:gap-3"
              >
                <button
                  type="button"
                  onClick={() => onMovieClick(activeBase.id)}
                  className="shine group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand-glow transition-all duration-300 ease-(--ease-out-expo) hover:scale-[1.04] hover:bg-brand-hover active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span>Watch Now</span>
                </button>

                {trailer && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Film className="h-4 w-4" aria-hidden="true" />
                    <span>Trailer</span>
                  </button>
                )}

                <Toggle
                  pressed={inWatchlist}
                  onPressedChange={() => toggleWatchlist(activeBase)}
                  aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  className="inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-pressed:border-white data-pressed:bg-white data-pressed:text-black"
                >
                  {inWatchlist ? (
                    <>
                      <Check key="on" className="h-4 w-4 animate-pop" aria-hidden="true" />
                      <span className="hidden sm:inline">In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Watchlist</span>
                    </>
                  )}
                </Toggle>
              </div>
            </div>

            {/* Mobile / tablet: segmented progress */}
            {count > 1 && (
              <div
                className="mt-6 flex items-center gap-2 lg:hidden"
                role="tablist"
                aria-label="Featured titles"
              >
                {featuredPool.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeIndex}
                    aria-label={`Feature ${item.title}`}
                    onClick={() => goTo(idx)}
                    className="flex h-10 flex-1 cursor-pointer items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand"
                  >
                    {progressBar(idx)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: thumbnail rail with per-slide progress */}
          {count > 1 && (
            <div
              className="hidden w-64 shrink-0 flex-col gap-2.5 lg:flex xl:w-72"
              role="tablist"
              aria-label="Featured titles"
              aria-orientation="vertical"
            >
              {featuredPool.map((item, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Feature ${item.title}`}
                    onClick={() => goTo(idx)}
                    style={{ '--i': idx } as React.CSSProperties}
                    className={`group/t flex animate-slide-in-right cursor-pointer items-center gap-3 rounded-2xl border p-2 text-left backdrop-blur-md transition-all duration-500 ease-(--ease-out-expo) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      selected
                        ? 'border-white/30 bg-black/65'
                        : 'border-white/10 bg-black/40 opacity-80 hover:border-white/25 hover:opacity-100'
                    }`}
                  >
                    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10">
                      <Thumb path={item.backdrop_path} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="mt-2 block">{progressBar(idx)}</span>
                    </span>
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
