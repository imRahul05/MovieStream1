import { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, SearchX, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
    <div className="space-y-6" role="status" aria-label="Loading movies">
      <div className="space-y-2.5">
        <div className="skeleton h-8 w-52 rounded-lg" />
        <div className="skeleton h-4 w-72 max-w-full rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2.5">
            <div className="skeleton aspect-[2/3] rounded-2xl border border-border" />
            <div className="skeleton h-4 w-3/4 rounded-md" />
            <div className="skeleton h-3 w-1/3 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmpty = ({
    icon: Icon,
    title,
    body,
    cta,
    onCta,
  }: {
    icon: LucideIcon;
    title: string;
    body: React.ReactNode;
    cta: string;
    onCta: () => void;
  }) => (
    <div className="relative my-10 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center sm:my-14 sm:py-20">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-brand-soft blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mb-6 animate-float">
        <span className="absolute inset-0 rounded-3xl border border-brand/40 animate-blip" aria-hidden="true" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-border-strong bg-surface-elevated text-brand animate-glow-pulse">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      </div>
      <h2 className="relative font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <button
        type="button"
        onClick={onCta}
        className="shine relative mt-7 min-h-11 cursor-pointer rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand-glow transition-all duration-300 hover:scale-[1.04] hover:bg-brand-hover active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {cta}
      </button>
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
            className="group mb-2 inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
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
            renderEmpty({
              icon: SearchX,
              title: 'No movies found',
              body: 'We couldn\u2019t find any titles matching your search. Try another title or explore trending films.',
              cta: 'Explore Home',
              onCta: () => handleSectionChange('home'),
            })
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
          renderEmpty({
            icon: Bookmark,
            title: 'Your watchlist is empty',
            body: (
              <>
                Tap the <span className="font-semibold text-foreground">+</span> icon on any movie poster to save it here for quick access.
              </>
            ),
            cta: 'Browse Trending',
            onCta: () => handleSectionChange('trending'),
          })
        );
      default:
        return (
          <div className="space-y-2">
            <MovieGrid
              title="Trending Now"
              subtitle="Fresh releases and buzzing titles this week"
              movies={trending}
              onMovieClick={handleMovieClick}
              showControls
              rail
              action={
                <button
                  type="button"
                  onClick={() => handleSectionChange('trending')}
                  className="group inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              }
            />

            <MovieGrid
              title="Top Rated"
              subtitle="Critically acclaimed essentials"
              movies={topRated}
              onMovieClick={handleMovieClick}
              rail
              action={
                <button
                  type="button"
                  onClick={() => handleSectionChange('top-rated')}
                  className="group inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              }
            />

            {watchlist.length > 0 && (
              <MovieGrid
                title="From Your Watchlist"
                subtitle="Pick up where you left off"
                movies={watchlist}
                onMovieClick={handleMovieClick}
                rail
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
          <div
            className="skeleton relative flex h-[clamp(540px,86svh,780px)] w-full items-end border-b border-border lg:h-[clamp(580px,80svh,820px)]"
            role="status"
            aria-label="Loading featured film"
          >
            <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 pb-10 sm:px-6 lg:px-8">
              <div className="h-7 w-36 rounded-full bg-surface-hover/70" />
              <div className="h-12 w-3/4 max-w-xl rounded-xl bg-surface-hover/70" />
              <div className="h-4 w-full max-w-md rounded-md bg-surface-hover/70" />
              <div className="h-12 w-40 rounded-full bg-surface-hover/70" />
            </div>
          </div>
        ) : trending.length > 0 ? (
          <FeaturedMovie movies={trending} onMovieClick={handleMovieClick} />
        ) : null)}

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8">
        <div
          key={isLoading ? 'loading' : currentSection}
          className={currentSection === 'home' ? 'animate-fade-in' : 'animate-blur-in'}
        >
          {renderContent()}
        </div>
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