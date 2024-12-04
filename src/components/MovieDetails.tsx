import { X } from 'lucide-react';
import type { MovieDetails } from '../types/movie';
import StreamingInfo from './StreamingInfo';
import ReviewSection from './ReviewSection';
import VideoPlayer from './VideoPlayer';
import EpisodeList from './EpisodeList';
import { getVideoUrl } from '../services/video';
import { useState, useEffect } from 'react';

interface MovieDetailsModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, onClose }: MovieDetailsModalProps) {
  const [videoUrl, setVideoUrl] = useState(() => 
    getVideoUrl(movie.media_type || 'movie', movie.id, movie.imdb_id)
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEpisodeSelect = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 text-white/80 hover:text-white bg-black/50 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative">
            <VideoPlayer
              mediaId={String(movie.id)}
              mediaType={movie.media_type || 'movie'}
              videoUrl={videoUrl}
              posterPath={movie.backdrop_path}
              imdbId={movie.imdb_id}
            />
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-white/80"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-white/80 mb-6">{movie.overview}</p>

            <div className="grid grid-cols-1 gap-8">
              {movie.seasons && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Episodes</h3>
                  <EpisodeList
                    seasons={movie.seasons}
                    seriesId={movie.id}
                    onEpisodeSelect={handleEpisodeSelect}
                  />
                </div>
              )}

              <StreamingInfo watchProviders={movie.watchProviders} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Cast</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.credits.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="text-center">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : 'https://via.placeholder.com/185x278'
                          }
                          alt={actor.name}
                          className="w-24 h-24 object-cover rounded-full mb-2"
                        />
                        <p className="text-white font-medium">{actor.name}</p>
                        <p className="text-white/60 text-sm">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-white/60">Release Date</dt>
                      <dd className="text-white">
                        {new Date(movie.release_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Runtime</dt>
                      <dd className="text-white">{movie.runtime} minutes</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Rating</dt>
                      <dd className="text-white">{movie.vote_average.toFixed(1)}/10</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <ReviewSection movieId={String(movie.id)} initialReviews={movie.reviews.results} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}