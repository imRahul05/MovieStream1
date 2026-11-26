import { useState } from 'react';
import { Tv } from 'lucide-react';
import type { MovieDetails } from '../types/movie';

interface StreamingInfoProps {
  watchProviders: MovieDetails['watchProviders'];
}

type Provider = { provider_id: number; provider_name: string; logo_path: string };

function ProviderTile({ provider, index }: { provider: Provider; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="animate-fade-up inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface-elevated px-3.5 py-2 transition-all duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover"
      style={{ '--i': index, animationDelay: `calc(var(--i) * 45ms)` } as React.CSSProperties}
    >
      {failed || !provider.logo_path ? (
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft font-display text-xs font-bold text-brand"
        >
          {provider.provider_name.slice(0, 1).toUpperCase()}
        </span>
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt=""
          onError={() => setFailed(true)}
          className="h-7 w-7 rounded-md object-cover"
        />
      )}
      <span className="text-sm font-medium text-foreground">{provider.provider_name}</span>
    </div>
  );
}

export default function StreamingInfo({ watchProviders }: StreamingInfoProps) {
  if (!watchProviders) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong py-10 text-center text-muted-foreground">
        <span className="relative mb-3 grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
          <span className="animate-blip absolute inset-0 rounded-full bg-brand/30" aria-hidden="true" />
          <Tv className="relative h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-foreground">No regional streaming providers listed</p>
        <p className="mt-0.5 max-w-xs px-4 text-xs">
          Use the built-in player above to watch the trailer or stream directly.
        </p>
      </div>
    );
  }

  const { flatrate, rent, buy } = watchProviders;

  const renderProviders = (providers: Provider[] | undefined, title: string) => {
    if (!providers?.length) return null;

    return (
      <section className="mb-6 last:mb-0" aria-label={title}>
        <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-px w-5 bg-brand" aria-hidden="true" />
          {title}
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {providers.map((provider, i) => (
            <ProviderTile key={provider.provider_id} provider={provider} index={i} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div>
      {renderProviders(flatrate, 'Included with Subscription')}
      {renderProviders(rent, 'Available to Rent')}
      {renderProviders(buy, 'Available to Buy')}
    </div>
  );
}
