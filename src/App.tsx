import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import MovieDetailsModal from './components/MovieDetails';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import FeaturedMovie from './components/FeaturedMovie';
import { fetchTrending, fetchTopRated, fetchMovieDetails, searchMovies } from './services/api';
import type { Movie, MovieDetails } from './types/movie';
import { useWatchlist } from './hooks/useWatchlist';
import { SpeedInsights } from "@vercel/speed-insights/react"
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('home');
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [trendingData, topRatedData] = await Promise.all([
          fetchTrending(),
          fetchTopRated(),
        ]);
        setTrending(trendingData.results);
        setTopRated(topRatedData.results);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await fetchMovieDetails(String(movieId));
      setSelectedMovie(details);
    } catch (error) {
      console.error('Failed to load movie details:', error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await searchMovies(query);
      setSearchResults(results.results);
      setCurrentSection('search');
    } catch (error) {
      console.error('Failed to search movies:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin">
          <Film className="w-12 h-12 text-purple-500" />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (searchResults.length > 0 && currentSection === 'search') {
      return (
        <MovieGrid
          title="Search Results"
          movies={searchResults}
          onMovieClick={handleMovieClick}
        />
      );
    }

    switch (currentSection) {
      case 'trending':
        return (
          <MovieGrid
            title="Trending Now"
            movies={trending}
            onMovieClick={handleMovieClick}
          />
        );
      case 'top-rated':
        return (
          <MovieGrid
            title="Top Rated"
            movies={topRated}
            onMovieClick={handleMovieClick}
          />
        );
      case 'watchlist':
        return watchlist.length > 0 ? (
          <MovieGrid
            title="My Watchlist"
            movies={watchlist}
            onMovieClick={handleMovieClick}
          />
        ) : (
          <div className="text-center text-white/60 py-12">
            <p>Your watchlist is empty</p>
          </div>
        );
      default:
        return (
          <>
            {trending.length > 0 && (
              <div className="mb-8">
                <FeaturedMovie
                  movieId={trending[0].id}
                  onMovieClick={handleMovieClick}
                />
              </div>
            )}
            <MovieGrid
              title="Trending Now"
              movies={trending.slice(1)}
              onMovieClick={handleMovieClick}
            />
            <MovieGrid
              title="Top Rated"
              movies={topRated}
              onMovieClick={handleMovieClick}
            />
            {watchlist.length > 0 && (
              <MovieGrid
                title="My Watchlist"
                movies={watchlist}
                onMovieClick={handleMovieClick}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <div className="lg:ml-64">
        <header className="bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Film className="w-8 h-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-white">MovieStream</h1>
                <button
            onClick={() => window.open('https://imrahul05.vercel.app', '_blank')}
            className="mt-4 py-2 px-3 rounded bg-gradient-to-r from-purple-400 via-pink-500 to-green-500 text-white transition-all duration-500 ease-in-out transform hover:scale-105 ml-5"
          >
            Visit My Portfolio
          </button>
              </div>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
  <SpeedInsights />
  <Analytics/>
        <Footer />
      </div>
    </div>
  );
}

export default App;