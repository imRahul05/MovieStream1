import { useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@ui-sdk/react/accordion';
import type { Episode, Season } from '../types/movie';
import { getVideoUrl } from '../services/video';
import { focusRing } from './details/dialogStyles';

interface EpisodeListProps {
  seasons: Season[];
  seriesId: number;
  onEpisodeSelect: (videoUrl: string) => void;
}

export default function EpisodeList({
  seasons,
  seriesId,
  onEpisodeSelect,
}: EpisodeListProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    setActiveKey(`${seasonNumber}-${episodeNumber}`);
    const videoUrl = getVideoUrl('tv', seriesId, {
      season: seasonNumber,
      episode: episodeNumber,
    });
    onEpisodeSelect(videoUrl);
  };

  const defaultSeason = seasons[0] ? [String(seasons[0].season_number)] : [];

  return (
    <Accordion defaultValue={defaultSeason} className="space-y-3">
      {seasons.map((season) => (
        <AccordionItem
          key={season.id}
          value={String(season.season_number)}
          className="overflow-hidden rounded-2xl border border-border bg-surface-elevated/50 transition-colors data-open:border-border-strong"
        >
          <AccordionHeader>
            <AccordionTrigger
              className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-foreground transition-colors hover:bg-surface-hover/60 sm:px-5 ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0`}
            >
              <div>
                <span className="font-display text-base font-semibold">
                  {season.name && !/^season\s/i.test(season.name) ? season.name : `Season ${season.season_number}`}
                </span>
                <p className="font-mono text-xs text-muted-foreground">
                  {season.episode_count} Episodes
                </p>
              </div>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-(--ease-out-expo) group-data-open:rotate-180 group-data-open:text-brand"
              />
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden border-t border-border transition-[height] duration-400 ease-(--ease-out-expo) data-starting-style:h-0 data-ending-style:h-0">
            {season.episodes && season.episodes.length > 0 ? (
              season.episodes.map((episode: Episode, i) => {
                const key = `${season.season_number}-${episode.episode_number}`;
                const active = activeKey === key;
                return (
                  <button
                    key={episode.id}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => handleEpisodeClick(season.season_number, episode.episode_number)}
                    className={`group/ep relative flex w-full cursor-pointer items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-hover/60 sm:gap-4 sm:px-5 sm:py-3.5 ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0 ${active ? 'bg-brand-soft' : ''}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-[3px] origin-center bg-brand transition-transform duration-300 ease-(--ease-out-expo) ${active ? 'scale-y-100' : 'scale-y-0 group-hover/ep:scale-y-50'}`}
                    />
                    <div
                      className="animate-fade-in relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:w-36"
                      style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                    >
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/ep:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(100%_100%_at_30%_0%,var(--brand-soft),transparent_70%)] font-display text-2xl font-extrabold text-muted-foreground/60">
                          {episode.episode_number}
                        </div>
                      )}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/ep:opacity-100 group-focus-visible/ep:opacity-100">
                        <Play className="h-5 w-5 fill-white text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="truncate">
                          {episode.episode_number}. {episode.name}
                        </span>
                        {active && (
                          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">
                            <span className="blip-dot" aria-hidden="true" />
                            Playing
                          </span>
                        )}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {episode.overview}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                Episode details aren&rsquo;t available for this season yet.
              </p>
            )}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
