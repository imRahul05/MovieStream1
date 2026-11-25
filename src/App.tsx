import { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, SearchX, ChevronRight } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import MovieDetailsModal from './components/MovieDetails';
import Sidebar from './components/Sidebar';
import FeaturedMovie from './components/FeaturedMovie';
import {
  fetchTrending,
  fetchTopRated,
  fetchMovieDetails,
  searchMovies,
  discoverMovies,
} from './services/api';
import type { Movie, MovieDetails } from './types/movie';
import { useWatchlist } from './hooks/useWatchlist';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';
import DevelopmentBanner from './components/DevelopmentBanner';

function App() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLabel, setSearchLabel] = useState('');
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
        setTrending(trendingData.results ?? []);
        setTopRated(topRatedData.results ?? []);
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
      setSearchResults(results.results ?? []);
      setSearchLabel(`Results for “${query}”`);
      setCurrentSection('search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to search movies:', error);
    }
  };

  const handleGenreSelect = async (genreId: number, genreName: string) => {
    try {
      const results = await discoverMovies({ with_genres: String(genreId) });
      setSearchResults(results.results ?? []);
      setSearchLabel(`${genreName} Films`);
      setCurrentSection('search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to filter by genre:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-44 rounded-lg bg-surface-elevated" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2.5">
            <div className="aspect-[2/3] rounded-xl bg-surface-elevated border border-border" />
            <div className="h-4 w-3/4 rounded bg-surface-elevated" />
            <div className="h-3 w-1/3 rounded bg-surface-elevated" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderSkeleton();

    if (currentSection === 'search') {
      return (
        <div>
          <button
            type="button"
            onClick={() => handleSectionChange('home')}
            className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>

          {searchResults.length > 0 ? (
            <MovieGrid
              title={searchLabel || 'Search Results'}
              subtitle="Filter by genre or sort to refine your discovery"
              movies={searchResults}
              onMovieClick={handleMovieClick}
              showControls
            />
          ) : (
            <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <h2 className="font-display text-lg font-bold text-foreground">
                No movies found
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                We couldn&rsquo;t find any titles matching your search. Try another title or explore trending films.
              </p>
              <button
                type="button"
                onClick={() => handleSectionChange('home')}
                className="mt-5 rounded-full bg-brand hover:bg-brand-hover px-5 py-2.5 text-xs font-semibold text-brand-foreground transition-colors cursor-pointer"
              >
                Explore Home
              </button>
            </div>
          )}
        </div>
      );
    }

    switch (currentSection) {
      case 'trending':
        return (
          <MovieGrid
            title="Trending Now"
            subtitle="The most watched films across cinema this week"
            movies={trending}
            onMovieClick={handleMovieClick}
            showControls
          />
        );
      case 'top-rated':
        return (
          <MovieGrid
            title="Top Rated Cinema"
            subtitle="All-time audience and critic favorites"
            movies={topRated}
            onMovieClick={handleMovieClick}
            showControls
          />
        );
      case 'watchlist':
        return watchlist.length > 0 ? (
          <MovieGrid
            title="My Watchlist"
            subtitle="Films you saved to watch later"
            movies={watchlist}
            onMovieClick={handleMovieClick}
            showControls
          />
        ) : (
          <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated border border-border text-muted-foreground mb-4">
              <Bookmark className="h-5 w-5" />
            </span>
            <h2 className="font-display text-xl font-bold text-foreground">
              Your watchlist is empty
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
              Tap the <span className="font-semibold text-foreground">+</span> icon on any movie poster to save it here for quick access.
            </p>
            <button
              type="button"
              onClick={() => handleSectionChange('trending')}
              className="mt-5 rounded-full bg-brand hover:bg-brand-hover px-5 py-2.5 text-xs font-semibold text-brand-foreground transition-colors cursor-pointer"
            >
              Browse Trending
            </button>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <MovieGrid
              title="Trending Now"
              subtitle="Fresh releases and buzzing titles this week"
              movies={trending}
              onMovieClick={handleMovieClick}
              showControls
              action={
                <button
                  type="button"
                  onClick={() => handleSectionChange('trending')}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
            />

            <MovieGrid
              title="Top Rated"
              subtitle="Critically acclaimed essentials"
              movies={topRated}
              onMovieClick={handleMovieClick}
              action={
                <button
                  type="button"
                  onClick={() => handleSectionChange('top-rated')}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
            />

            {watchlist.length > 0 && (
              <MovieGrid
                title="From Your Watchlist"
                subtitle="Pick up where you left off"
                movies={watchlist}
                onMovieClick={handleMovieClick}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onSearch={handleSearch}
        onMovieSelect={handleMovieClick}
        onGenreSelect={handleGenreSelect}
      />

      {/* Full-bleed edge-to-edge Hero on Home */}
      {currentSection === 'home' &&
        (isLoading ? (
          <div className="w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] xl:min-h-[680px] bg-surface-elevated border-b border-border animate-pulse" />
        ) : trending.length > 0 ? (
          <FeaturedMovie movies={trending} onMovieClick={handleMovieClick} />
        ) : null)}

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-8">
        {renderContent()}
      </main>

      <DevelopmentBanner />

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Footer onNavigate={handleSectionChange} />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;