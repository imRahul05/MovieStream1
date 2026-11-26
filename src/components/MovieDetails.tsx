import { X, Clock, Calendar, Bookmark, Check, User } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@ui-sdk/react/dialog';
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from '@ui-sdk/react/tabs';
import { Toggle } from '@ui-sdk/react/toggle';
import type { MovieDetails } from '../types/movie';
import StreamingInfo from './StreamingInfo';
import ReviewSection from './ReviewSection';
import VideoPlayer from './VideoPlayer';
import EpisodeList from './EpisodeList';
import RatingRing from './details/RatingRing';
import { dialogBackdropClass, dialogPanelMotion, focusRing } from './details/dialogStyles';
import { getVideoUrl } from '../services/video';
import { useWatchlist } from '../hooks/useWatchlist';

interface MovieDetailsModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

const tabClass = `relative shrink-0 cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground data-selected:text-foreground ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0`;
const panelClass =
  'animate-fade-up [animation-duration:500ms] focus-visible:outline-none';

const stagger = (i: number) => ({ '--i': i + 2 }) as React.CSSProperties;

export default function MovieDetailsModal({ movie, onClose }: MovieDetailsModalProps) {
  const [open, setOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState(() =>
    getVideoUrl(movie.media_type || 'movie', movie.id)
  );
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const mediaType = movie.media_type || 'movie';
  const hasSeasons = !!movie.seasons && movie.seasons.length > 0;
  const atmosphere = movie.backdrop_path || movie.poster_path;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const cast = movie.credits?.cast ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
      onOpenChangeComplete={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogBackdrop className={dialogBackdropClass} />
      <DialogContent
        className={`fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-surface p-0 text-foreground max-sm:data-starting-style:translate-y-10 max-sm:data-starting-style:scale-100 max-sm:data-ending-style:translate-y-10 max-sm:data-ending-style:scale-100 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[92dvh] sm:w-[calc(100%-3rem)] sm:max-w-5xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border sm:border-border-strong sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ${dialogPanelMotion}`}
      >
        {/* Close button: lives outside the scroller so it is always reachable */}
        <DialogClose
          aria-label="Close movie details"
          className={`group absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 ease-(--ease-out-expo) hover:scale-110 hover:bg-black/80 sm:right-4 sm:top-4 ${focusRing}`}
        >
          <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
        </DialogClose>

        <div className="max-h-dvh overflow-y-auto overscroll-contain sm:max-h-[92dvh]">
          <div className="relative isolate pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {/* Atmosphere: ken-burns backdrop, grain and scrims */}
            <div className="grain pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden" aria-hidden="true">
              {atmosphere && (
                <img
                  src={`https://image.tmdb.org/t/p/w1280${atmosphere}`}
                  alt=""
                  className="animate-ken-burns h-full w-full scale-110 object-cover opacity-45 blur-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_0%,var(--brand-soft),transparent_70%)]" />
              <div className="absolute inset-0 bg-linear-to-b from-surface/40 via-surface/80 to-surface" />
            </div>

            {/* Player */}
            <div className="px-0 pt-0 sm:px-6 sm:pt-6">
              <VideoPlayer
                mediaId={String(movie.id)}
                mediaType={mediaType}
                videoUrl={videoUrl}
                posterPath={movie.backdrop_path}
                imdbId={movie.imdb_id}
              />
            </div>

            {/* Header */}
            <div className="px-5 pt-6 sm:px-9 sm:pt-8">
              <div className="stagger flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className="min-w-0 flex-1">
                  <p
                    className="animate-fade-up mb-3 flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand"
                    style={stagger(0)}
                  >
                    <span className="blip-dot" aria-hidden="true" />
                    {mediaType === 'tv' ? 'Series' : 'Film'}
                    {year && <span className="text-muted-foreground">/ {year}</span>}
                  </p>
                  <DialogTitle
                    className="animate-fade-up font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground wrap-break-word sm:text-4xl lg:text-5xl"
                    style={stagger(1)}
                  >
                    {movie.title}
                  </DialogTitle>

                  <div
                    className="animate-fade-up mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground"
                    style={stagger(2)}
                  >
                    {movie.release_date && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        {new Date(movie.release_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {movie.runtime > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-foreground">
                        <Clock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    )}
                  </div>

                  {movie.genres?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {movie.genres.map((genre, i) => (
                        <span
                          key={genre.id}
                          className="animate-fade-up rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-muted-foreground"
                          style={stagger(3 + i)}
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="animate-fade-up flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-4"
                  style={stagger(4)}
                >
                  {movie.vote_average > 0 && <RatingRing value={movie.vote_average} />}
                  <Toggle
                    pressed={inWatchlist}
                    onPressedChange={() => toggleWatchlist(movie)}
                    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong bg-surface-elevated px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-surface-hover active:scale-95 data-pressed:border-brand data-pressed:bg-brand data-pressed:text-brand-foreground data-pressed:shadow-[0_0_24px_var(--brand-glow)] max-sm:flex-1 ${focusRing}`}
                  >
                    <span key={String(inWatchlist)} className="animate-pop inline-flex" aria-hidden="true">
                      {inWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </span>
                    <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </Toggle>
                </div>
              </div>

              <DialogDescription className="sr-only">
                {movie.overview || `Details for ${movie.title}`}
              </DialogDescription>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="mt-8">
                <TabsList
                  aria-label="Movie details sections"
                  className="no-scrollbar relative flex items-center gap-1 overflow-x-auto border-b border-border-strong"
                >
                  <TabsTab value="overview" className={tabClass}>
                    Overview
                  </TabsTab>
                  <TabsTab value="streaming" className={tabClass}>
                    Where to Watch
                  </TabsTab>
                  {hasSeasons && (
                    <TabsTab value="episodes" className={tabClass}>
                      Episodes
                    </TabsTab>
                  )}
                  <TabsTab value="reviews" className={tabClass}>
                    Reviews
                  </TabsTab>
                  <TabsIndicator className="pointer-events-none absolute bottom-0 left-(--active-tab-left) h-0.5 w-(--active-tab-width) rounded-full bg-brand shadow-[0_0_12px_var(--brand-glow)] transition-[left,width] duration-400 ease-(--ease-out-expo) data-[activation-direction=none]:transition-none" />
                </TabsList>

                <div className="pt-6">
                  <TabsPanel value="overview" className={`${panelClass} space-y-8`}>
                    <p className="max-w-3xl text-base leading-relaxed text-foreground/90 sm:text-[17px]">
                      {movie.overview || 'No synopsis available for this title.'}
                    </p>

                    {cast.length > 0 && (
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="h-px w-5 bg-brand" aria-hidden="true" />
                          Top Cast
                        </h3>
                        <ul className="stagger grid grid-cols-3 gap-3 sm:grid-cols-6">
                          {cast.slice(0, 6).map((actor, i) => (
                            <li
                              key={actor.id}
                              style={{ '--i': i } as React.CSSProperties}
                              className="animate-fade-up flex min-w-0 flex-col items-center rounded-2xl border border-border bg-surface-elevated/60 p-3 text-center transition-all duration-300 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-border-strong"
                            >
                              <div className="mb-2.5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface">
                                {actor.profile_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <User className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                                )}
                              </div>
                              <p className="w-full truncate text-xs font-semibold text-foreground">
                                {actor.name}
                              </p>
                              <p className="mt-0.5 w-full truncate text-[11px] text-muted-foreground">
                                {actor.character}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsPanel>

                  <TabsPanel value="streaming" className={panelClass}>
                    <StreamingInfo watchProviders={movie.watchProviders} />
                  </TabsPanel>

                  {hasSeasons && (
                    <TabsPanel value="episodes" className={panelClass}>
                      <EpisodeList
                        seasons={movie.seasons!}
                        seriesId={movie.id}
                        onEpisodeSelect={setVideoUrl}
                      />
                    </TabsPanel>
                  )}

                  <TabsPanel value="reviews" className={panelClass}>
                    <ReviewSection
                      movieId={String(movie.id)}
                      initialReviews={movie.reviews?.results ?? []}
                    />
                  </TabsPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
