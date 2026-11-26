import {
  Menu,
  X,
  ExternalLink,
  Search,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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
import Logo, { LogoMark } from './nav/Logo';
import WatchlistBadge from './nav/WatchlistBadge';
import { NAV_ITEMS, PORTFOLIO_URL, FOCUS_RING } from './nav/navItems';
import { useWatchlist } from '../hooks/useWatchlist';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onSearch: (query: string) => void;
  onMovieSelect: (movieId: number) => void;
  onGenreSelect: (genreId: number, genreName: string) => void;
}

/* ------------------------------------------------------------------ */
/* Desktop nav with a sliding active pill                              */
/* ------------------------------------------------------------------ */

interface DesktopNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  count: number;
}

function DesktopNav({ currentSection, onSectionChange, count }: DesktopNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [animated, setAnimated] = useState(false);

  const measure = useCallback(() => {
    const el = itemRefs.current.get(currentSection);
    setPill(el && el.offsetWidth > 0 ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [currentSection]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Enable the slide transition only after the first placement
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Re-measure when the nav or any item changes size (fonts, badge, breakpoints)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(nav);
    itemRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  return (
    <nav
      ref={navRef}
      className="relative isolate hidden lg:flex items-center gap-0.5"
      aria-label="Primary navigation"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -z-10 h-9 -translate-y-1/2 rounded-full border border-border-strong bg-surface-elevated"
        style={{
          left: pill?.left ?? 0,
          width: pill?.width ?? 0,
          opacity: pill ? 1 : 0,
          transition: animated
            ? 'left 520ms var(--ease-out-expo), width 520ms var(--ease-out-expo), opacity 200ms ease'
            : 'none',
        }}
      >
        <span className="absolute inset-x-5 -bottom-px h-px bg-linear-to-r from-transparent via-brand to-transparent" />
      </span>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = currentSection === item.id;
        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
              else itemRefs.current.delete(item.id);
            }}
            type="button"
            onClick={() => onSectionChange(item.id)}
            aria-current={active ? 'page' : undefined}
            className={`group relative inline-flex h-9 items-center gap-2 rounded-full px-3 xl:px-3.5 text-sm font-medium transition-colors duration-300 cursor-pointer ${FOCUS_RING} ${
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`hidden xl:block h-4 w-4 transition-all duration-300 ease-(--ease-spring) ${
                active ? 'text-brand scale-110' : 'group-hover:scale-110'
              }`}
            />
            <span>{item.label}</span>
            {item.id === 'watchlist' && <WatchlistBadge count={count} />}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile bottom tab bar with sliding indicator                        */
/* ------------------------------------------------------------------ */

function BottomTabs({ currentSection, onSectionChange, count }: DesktopNavProps) {
  const index = NAV_ITEMS.findIndex((i) => i.id === currentSection);
  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-glass backdrop-blur-xl pb-safe"
    >
      <div className="relative mx-auto grid h-14 max-w-md grid-cols-4 px-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-0 h-full w-[calc((100%-1rem)/4)] transition-[transform,opacity] duration-500 ease-(--ease-out-expo)"
          style={{
            transform: `translateX(${Math.max(index, 0) * 100}%)`,
            opacity: index < 0 ? 0 : 1,
          }}
        >
          <span className="absolute inset-x-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_12px_2px_var(--brand-glow)]" />
          <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-linear-to-b from-brand-soft to-transparent" />
        </span>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors duration-300 cursor-pointer active:scale-95 ${FOCUS_RING} ${
                active ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="relative">
                <Icon
                  aria-hidden="true"
                  className={`h-5 w-5 transition-transform duration-500 ease-(--ease-spring) ${
                    active ? '-translate-y-0.5 scale-110' : ''
                  }`}
                />
                {item.id === 'watchlist' && (
                  <WatchlistBadge count={count} className="absolute -right-3 -top-2 !h-4 !min-w-4 !px-1 !text-[9px]" />
                )}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export default function Sidebar({
  currentSection,
  onSectionChange,
  onSearch,
  onMovieSelect,
  onGenreSelect,
}: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const { watchlist } = useWatchlist();
  const count = watchlist.length;

  // Passive scroll listener: hairline + shadow once scrolled, accent progress line
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const iconButton = `inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated/70 text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-90 transition-all duration-200 cursor-pointer ${FOCUS_RING}`;

  return (
    <>
      {/* Sticky glass header */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 ${
          scrolled
            ? 'border-border bg-glass shadow-[0_12px_32px_-20px_rgba(0,0,0,0.55)]'
            : 'border-transparent bg-glass/60'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 h-16`}
        >
          {/* Left: drawer trigger, brand, desktop nav */}
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4 lg:gap-6">
            <Drawer
              side="left"
              open={drawerOpen}
              onOpenChange={(next) => setDrawerOpen(next)}
            >
              <DrawerTrigger
                aria-label="Open navigation menu"
                className={`lg:hidden ${iconButton}`}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </DrawerTrigger>

              <DrawerBackdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
              <DrawerContent className="relative z-50 flex h-full w-80 max-w-[85vw] flex-col overflow-hidden rounded-r-3xl border-r border-border-strong bg-surface p-5 pb-safe shadow-2xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-soft blur-3xl"
                />

                <div className="relative flex items-center justify-between border-b border-border pb-5">
                  <div className="flex items-center gap-2.5">
                    <LogoMark />
                    <DrawerTitle className="font-display text-lg font-extrabold tracking-tight text-foreground">
                      Movie<span className="text-brand">Stream</span>
                    </DrawerTitle>
                  </div>
                  <DrawerClose
                    aria-label="Close navigation menu"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground hover:rotate-90 transition-all duration-300 cursor-pointer ${FOCUS_RING}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </DrawerClose>
                </div>

                <nav className="relative mt-5 flex-1 space-y-1.5" aria-label="Mobile menu">
                  {NAV_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const active = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          onSectionChange(item.id);
                          setDrawerOpen(false);
                        }}
                        style={{ animationDelay: `${140 + i * 60}ms` }}
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-200 cursor-pointer animate-[fade-up_520ms_var(--ease-out-expo)_both] ${FOCUS_RING} ${
                          active
                            ? 'bg-brand-soft text-foreground'
                            : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-brand transition-transform duration-500 ease-(--ease-out-expo) origin-center ${
                            active ? 'scale-y-100' : 'scale-y-0'
                          }`}
                        />
                        <span className="flex items-center gap-3.5">
                          <Icon
                            aria-hidden="true"
                            className={`h-[18px] w-[18px] transition-transform duration-300 ease-(--ease-spring) group-hover:scale-110 ${
                              active ? 'text-brand' : ''
                            }`}
                          />
                          {item.label}
                        </span>
                        {item.id === 'watchlist' && <WatchlistBadge count={count} />}
                      </button>
                    );
                  })}
                </nav>

                <div
                  className="relative mt-auto space-y-4 border-t border-border pt-4 animate-[fade-up_520ms_var(--ease-out-expo)_both]"
                  style={{ animationDelay: '420ms' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Appearance
                    </span>
                    <ThemeSwitcher />
                  </div>
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors ${FOCUS_RING}`}
                  >
                    <span>Visit Portfolio</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  </a>
                </div>
              </DrawerContent>
            </Drawer>

            <Logo onClick={() => onSectionChange('home')} />

            <DesktopNav
              currentSection={currentSection}
              onSectionChange={onSectionChange}
              count={count}
            />
          </div>

          {/* Right: search, theme, portfolio */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <SearchBar
              open={searchOpen}
              onOpenChange={setSearchOpen}
              onSearch={onSearch}
              onMovieSelect={onMovieSelect}
              onNavigate={onSectionChange}
              onGenreSelect={onGenreSelect}
            />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className={`sm:hidden ${iconButton}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="hidden md:block">
              <ThemeSwitcher labelsFrom="xl" />
            </div>
            <div className="md:hidden">
              <ThemeSwitcher compact />
            </div>

            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden 2xl:inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-elevated/70 px-3.5 text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors ${FOCUS_RING}`}
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Scroll progress accent line */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            ref={progressRef}
            className="block h-full w-full origin-left bg-brand shadow-[0_0_10px_1px_var(--brand-glow)] will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      </header>

      <BottomTabs
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        count={count}
      />
    </>
  );
}
