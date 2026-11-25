import { X, Star, Clock, Calendar, Bookmark, Check, User } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@ui-sdk/react/dialog';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@ui-sdk/react/tabs';
import { Toggle } from '@ui-sdk/react/toggle';
import type { MovieDetails } from '../types/movie';
import StreamingInfo from './StreamingInfo';
import ReviewSection from './ReviewSection';
import VideoPlayer from './VideoPlayer';
import EpisodeList from './EpisodeList';
import { getVideoUrl } from '../services/video';
import { useWatchlist } from '../hooks/useWatchlist';

interface MovieDetailsModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, onClose }: MovieDetailsModalProps) {
  const [videoUrl, setVideoUrl] = useState(() =>
    getVideoUrl(movie.media_type || 'movie', movie.id)
  );
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleEpisodeSelect = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogBackdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <DialogContent
        aria-label={movie.title}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2.5rem)] max-w-4xl max-h-[92dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl sm:rounded-3xl border border-border-strong bg-surface shadow-2xl transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95"
      >
        {/* Close Button */}
        <DialogClose
          aria-label="Close movie details"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/15 hover:bg-black transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Video Player Area */}
        <div className="relative bg-black">
          <VideoPlayer
            mediaId={String(movie.id)}
            mediaType={movie.media_type || 'movie'}
            videoUrl={videoUrl}
            posterPath={movie.backdrop_path}
            imdbId={movie.imdb_id}
          />
        </div>

        {/* Details Body */}
        <div className="p-5 sm:p-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {movie.title}
              </DialogTitle>

              {/* Metadata Pills */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                {movie.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 font-semibold text-gold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {movie.vote_average.toFixed(1)} / 10
                  </span>
                )}
                {movie.release_date && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-elevated border border-border px-2.5 py-1 text-foreground">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(movie.release_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-elevated border border-border px-2.5 py-1 text-foreground">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
              </div>
            </div>

            <Toggle
              pressed={inWatchlist}
              onPressedChange={() => toggleWatchlist(movie)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors cursor-pointer data-pressed:bg-brand data-pressed:border-brand data-pressed:text-brand-foreground"
            >
              {inWatchlist ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved in Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </Toggle>
          </div>

          {/* Genre Badges */}
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Tabbed Content powered by UI SDK Tabs */}
          <Tabs defaultValue="overview">
            <TabsList
              aria-label="Movie details sections"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-border pb-px mb-6"
            >
              <TabsTab
                value="overview"
                className="shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:text-foreground data-selected:border-brand data-selected:text-foreground"
              >
                Overview &amp; Cast
              </TabsTab>
              <TabsTab
                value="streaming"
                className="shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:text-foreground data-selected:border-brand data-selected:text-foreground"
              >
                Where to Watch
              </TabsTab>
              {movie.seasons && movie.seasons.length > 0 && (
                <TabsTab
                  value="episodes"
                  className="shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:text-foreground data-selected:border-brand data-selected:text-foreground"
                >
                  Episodes
                </TabsTab>
              )}
              <TabsTab
                value="reviews"
                className="shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:text-foreground data-selected:border-brand data-selected:text-foreground"
              >
                Reviews
              </TabsTab>
            </TabsList>

            <TabsPanel value="overview" className="space-y-6 focus:outline-none">
              <p className="text-sm sm:text-base leading-relaxed text-foreground/85">
                {movie.overview || 'No synopsis available for this title.'}
              </p>

              {movie.credits?.cast?.length > 0 && (
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-3.5">
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {movie.credits.cast.slice(0, 6).map((actor) => (
                      <div
                        key={actor.id}
                        className="flex flex-col items-center rounded-xl border border-border bg-surface-elevated/60 p-3 text-center"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface mb-2.5 flex items-center justify-center">
                          {actor.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-foreground line-clamp-1">
                          {actor.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsPanel>

            <TabsPanel value="streaming" className="focus:outline-none">
              <StreamingInfo watchProviders={movie.watchProviders} />
            </TabsPanel>

            {movie.seasons && movie.seasons.length > 0 && (
              <TabsPanel value="episodes" className="focus:outline-none">
                <EpisodeList
                  seasons={movie.seasons}
                  seriesId={movie.id}
                  onEpisodeSelect={handleEpisodeSelect}
                />
              </TabsPanel>
            )}

            <TabsPanel value="reviews" className="focus:outline-none">
              <ReviewSection
                movieId={String(movie.id)}
                initialReviews={movie.reviews?.results ?? []}
              />
            </TabsPanel>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}