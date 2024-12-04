import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

export default function MovieGrid({ title, movies, onMovieClick }: MovieGridProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick(movie.id)}
          />
        ))}
      </div>
    </section>
  );
}