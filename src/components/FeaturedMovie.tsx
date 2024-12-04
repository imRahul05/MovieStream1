import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MovieDetails } from '../types/movie';
import { fetchMovieDetails } from '../services/api';

interface FeaturedMovieProps {
  movieId: number;
  onMovieClick: (movieId: number) => void;
}

export default function FeaturedMovie({ movieId, onMovieClick }: FeaturedMovieProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const details = await fetchMovieDetails(String(movieId));
        setMovie(details);
      } catch (error) {
        console.error('Failed to load featured movie:', error);
      }
    };
    loadMovie();
  }, [movieId]);

  if (!movie) return null;

  const trailer = movie.videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
      {isPlaying && trailer ? (
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay"
        />
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h2 className="text-4xl font-bold text-white mb-4">{movie.title}</h2>
        <p className="text-white/80 text-lg mb-6 max-w-2xl line-clamp-2">
          {movie.overview}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => onMovieClick(movie.id)}
            className="flex items-center gap-2 px-8 py-4 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors"
          >
            <Play className="w-6 h-6" />
            <span className="font-semibold">Watch Now</span>
          </button>
          {trailer && !isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
            >
              <Play className="w-6 h-6" />
              <span className="font-semibold">Play Trailer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}