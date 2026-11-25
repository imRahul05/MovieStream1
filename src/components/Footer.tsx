import React, { useState } from 'react';
import { Film, ShieldAlert } from 'lucide-react';
import SocialIcons from './SocialIcons';
import NewsletterForm from './NewsletterForm';
import DMCAModal from './DMCAModal';

interface FooterProps {
  onNavigate?: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isDMCAModalOpen, setIsDMCAModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border bg-surface text-foreground pb-20 lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <Film className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Movie<span className="text-brand">Stream</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Bringing the cinema experience home. Discover trending releases, critically acclaimed classics, and curate your personal watchlist.
            </p>
            <SocialIcons />
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'trending', label: 'Trending Now' },
                { id: 'top-rated', label: 'Top Rated' },
                { id: 'watchlist', label: 'My Watchlist' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground">
              Get weekly picks of top-rated films and upcoming cinema releases.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              &copy; {currentYear} MovieStream · Crafted by{' '}
              <a
                href="https://imrahul05.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-brand transition-colors"
              >
                Rahul
              </a>
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              This site does not store any files on our server; media is linked from 3rd-party services.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDMCAModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-brand/40 hover:text-brand transition-colors cursor-pointer"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>DMCA Notice</span>
          </button>
        </div>
      </div>

      <DMCAModal isOpen={isDMCAModalOpen} onClose={() => setIsDMCAModalOpen(false)} />
    </footer>
  );
};

export default Footer;
