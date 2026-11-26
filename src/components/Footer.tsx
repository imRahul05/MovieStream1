import React, { useState } from 'react';
import { ShieldAlert, ArrowUp } from 'lucide-react';
import SocialIcons from './SocialIcons';
import NewsletterForm from './NewsletterForm';
import DMCAModal from './DMCAModal';
import Logo from './nav/Logo';
import { NAV_ITEMS, FOCUS_RING } from './nav/navItems';
import { GENRES } from '../data/fallbackMovies';
import { useReveal } from '../hooks/useReveal';

interface FooterProps {
  onNavigate?: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isDMCAModalOpen, setIsDMCAModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const gridRef = useReveal<HTMLDivElement>();
  const bottomRef = useReveal<HTMLDivElement>();

  const goTo = (id: string) => {
    onNavigate?.(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border bg-surface text-foreground pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Genre marquee */}
      <div
        aria-hidden="true"
        className="group relative border-b border-border py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {GENRES.map((g) => (
                <li
                  key={`${copy}-${g.id}`}
                  className="flex items-center gap-6 pl-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  <span>{g.name}</span>
                  <span className="h-1 w-1 rounded-full bg-brand" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div ref={gridRef} className="reveal grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-5">
            <Logo onClick={() => goTo('home')} />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Bringing the cinema experience home. Discover trending releases, critically acclaimed classics, and curate your personal watchlist.
            </p>
            <SocialIcons />
          </div>

          {/* Quick links */}
          <nav className="space-y-3 md:col-span-3" aria-label="Footer">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-1 text-sm">
              {NAV_ITEMS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => goTo(link.id)}
                    className={`group inline-flex items-center gap-2 rounded py-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer ${FOCUS_RING}`}
                  >
                    <span className="h-px w-0 bg-brand transition-all duration-300 ease-(--ease-out-expo) group-hover:w-4" />
                    <span className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-0.5">
                      {link.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="space-y-3 md:col-span-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground">
              Get weekly picks of top-rated films and upcoming cinema releases.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div
          ref={bottomRef}
          className="reveal mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row"
        >
          <div className="space-y-1 text-center sm:text-left">
            <p>
              &copy; {currentYear} MovieStream · Crafted by{' '}
              <a
                href="https://imrahul05.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium text-foreground transition-colors hover:text-brand ${FOCUS_RING} rounded`}
              >
                Rahul
              </a>
            </p>
            <p className="text-[11px] text-muted-foreground">
              This site does not store any files on our server; media is linked from 3rd-party services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDMCAModalOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand cursor-pointer ${FOCUS_RING}`}
            >
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              <span>DMCA Notice</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className={`group inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-all duration-300 ease-(--ease-spring) hover:-translate-y-1 hover:border-brand hover:text-brand cursor-pointer ${FOCUS_RING}`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Large faint wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden px-4 pt-6 text-center [mask-image:linear-gradient(180deg,#000_30%,transparent_95%)]"
      >
        <p className="font-display text-[clamp(2.5rem,12.5vw,11rem)] font-extrabold uppercase leading-[0.85] tracking-tighter whitespace-nowrap text-foreground/[0.06]">
          MovieStream
        </p>
      </div>

      <DMCAModal isOpen={isDMCAModalOpen} onClose={() => setIsDMCAModalOpen(false)} />
    </footer>
  );
};

export default Footer;
