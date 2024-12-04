import { Plus, Check, Star } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="font-bold text-lg">{movie.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleWatchlistClick}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
      >
        {inWatchlist ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Plus className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}