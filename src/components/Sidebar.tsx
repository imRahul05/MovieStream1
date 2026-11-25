import {
  Home,
  Flame,
  Star,
  Bookmark,
  Menu,
  X,
  Film,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@ui-sdk/react/drawer';
import ThemeSwitcher from './ThemeSwitcher';
import SearchBar from './SearchBar';
import { useWatchlist } from '../hooks/useWatchlist';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onSearch: (query: string) => void;
  onMovieSelect: (movieId: number) => void;
  onGenreSelect: (genreId: number, genreName: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'top-rated', label: 'Top Rated', icon: Star },
  { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
];

export default function Sidebar({
  currentSection,
  onSectionChange,
  onSearch,
  onMovieSelect,
  onGenreSelect,
}: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { watchlist } = useWatchlist();

  return (
    <>
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-glass backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Drawer Trigger + Brand */}
          <div className="flex items-center gap-2.5 sm:gap-6">
            <Drawer
              side="left"
              open={drawerOpen}
              onOpenChange={(next) => setDrawerOpen(next)}
            >
              <DrawerTrigger
                aria-label="Open navigation menu"
                className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <Menu className="h-4 w-4" />
              </DrawerTrigger>

              <DrawerBackdrop className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
              <DrawerContent className="z-50 flex h-full w-72 max-w-[82vw] flex-col border-r border-border-strong bg-surface p-5 shadow-2xl">
                <div className="flex items-center justify-between pb-5 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm">
                      <Film className="h-4 w-4" />
                    </span>
                    <DrawerTitle className="font-display text-lg font-bold tracking-tight text-foreground">
                      MovieStream
                    </DrawerTitle>
                  </div>
                  <DrawerClose
                    aria-label="Close navigation menu"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </DrawerClose>
                </div>

                <nav className="mt-5 flex-1 space-y-1.5" aria-label="Mobile menu">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSectionChange(item.id);
                          setDrawerOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-brand text-brand-foreground'
                            : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {item.id === 'watchlist' && watchlist.length > 0 && (
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                              active
                                ? 'bg-white/20 text-white'
                                : 'bg-surface-hover text-foreground'
                            }`}
                          >
                            {watchlist.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-auto space-y-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Appearance
                    </span>
                    <ThemeSwitcher />
                  </div>
                  <a
                    href="https://imrahul05.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
                  >
                    <span>Visit Portfolio</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => onSectionChange('home')}
              className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm transition-transform group-hover:scale-105">
                <Film className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
                Movie<span className="text-brand">Stream</span>
              </span>
            </button>

            {/* Desktop Inline Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-surface-elevated text-foreground border border-border-strong'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${active ? 'text-brand' : 'text-current'}`}
                    />
                    <span>{item.label}</span>
                    {item.id === 'watchlist' && watchlist.length > 0 && (
                      <span className="ml-0.5 rounded-full bg-brand/15 px-1.5 py-0.2 font-mono text-[11px] font-semibold text-brand">
                        {watchlist.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Theme Switcher, Portfolio */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop/Tablet Search Trigger */}
            <div className="hidden sm:block">
              <SearchBar
                open={searchOpen}
                onOpenChange={setSearchOpen}
                onSearch={onSearch}
                onMovieSelect={onMovieSelect}
                onNavigate={onSectionChange}
                onGenreSelect={onGenreSelect}
              />
            </div>

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Theme Switcher: Segmented on md+, compact cycle button on mobile */}
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
            <div className="md:hidden">
              <ThemeSwitcher compact />
            </div>

            {/* Portfolio CTA on xl */}
            <a
              href="https://imrahul05.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 h-9 rounded-full border border-border bg-surface px-3.5 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-glass backdrop-blur-xl pb-safe"
      >
        <div className="grid grid-cols-4 h-14 max-w-md mx-auto px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  active ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.id === 'watchlist' && watchlist.length > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] font-bold text-brand-foreground">
                      {watchlist.length}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}