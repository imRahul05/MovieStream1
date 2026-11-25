import { Tv } from 'lucide-react';
import type { MovieDetails } from '../types/movie';

interface StreamingInfoProps {
  watchProviders: MovieDetails['watchProviders'];
}

export default function StreamingInfo({ watchProviders }: StreamingInfoProps) {
  if (!watchProviders) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">
        <Tv className="h-7 w-7 opacity-40 mb-2" />
        <p className="text-sm font-medium text-foreground">
          No regional streaming providers listed
        </p>
        <p className="text-xs mt-0.5">
          Use the built-in player above to watch the trailer or stream directly.
        </p>
      </div>
    );
  }

  const { flatrate, rent, buy } = watchProviders;

  const renderProviders = (
    providers:
      | { provider_id: number; provider_name: string; logo_path: string }[]
      | undefined,
    title: string
  ) => {
    if (!providers?.length) return null;

    return (
      <div className="mb-5 last:mb-0">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {title}
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {providers.map((provider) => (
            <div
              key={provider.provider_id}
              className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface-elevated px-3.5 py-2"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="h-6 w-6 rounded-md object-cover"
              />
              <span className="text-sm font-medium text-foreground">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderProviders(flatrate, 'Included with Subscription')}
      {renderProviders(rent, 'Available to Rent')}
      {renderProviders(buy, 'Available to Buy')}
    </div>
  );
}