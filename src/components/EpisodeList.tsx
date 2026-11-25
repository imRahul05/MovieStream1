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
  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
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
          className="overflow-hidden rounded-2xl border border-border bg-surface-elevated/50"
        >
          <AccordionHeader>
            <AccordionTrigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-foreground hover:bg-surface-hover/60 transition-colors cursor-pointer">
              <div>
                <span className="font-display text-base font-semibold">
                  Season {season.season_number}
                </span>
                <p className="font-mono text-xs text-muted-foreground">
                  {season.episode_count} Episodes
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180" />
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionPanel className="border-t border-border">
            {season.episodes?.map((episode: Episode) => (
              <button
                key={episode.id}
                type="button"
                onClick={() =>
                  handleEpisodeClick(season.season_number, episode.episode_number)
                }
                className="flex w-full items-center gap-4 border-b border-border px-5 py-3.5 text-left last:border-b-0 hover:bg-surface-hover/60 transition-colors cursor-pointer"
              >
                <div className="relative w-28 sm:w-36 aspect-video shrink-0 overflow-hidden rounded-lg bg-surface-elevated border border-border">
                  {episode.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                      alt={episode.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Play className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {episode.episode_number}. {episode.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {episode.overview}
                  </p>
                </div>
              </button>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}