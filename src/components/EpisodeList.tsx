import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Episode, Season } from '../types/movie';
import { getVideoUrl } from '../services/video';

interface EpisodeListProps {
  seasons: Season[];
  seriesId: number;
  onEpisodeSelect: (videoUrl: string) => void;
}

export default function EpisodeList({ seasons, seriesId, onEpisodeSelect }: EpisodeListProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(1);

  const handleEpisodeClick = (seasonNumber: number, episodeNumber: number) => {
    const videoUrl = getVideoUrl('tv', seriesId, {
      season: seasonNumber,
      episode: episodeNumber,
    });
    onEpisodeSelect(videoUrl);
  };

  return (
    <div className="space-y-4">
      {seasons.map((season) => (
        <div key={season.id} className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSeason(expandedSeason === season.season_number ? null : season.season_number)}
            className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700"
          >
            <div>
              <h3 className="text-lg font-semibold">Season {season.season_number}</h3>
              <p className="text-sm text-gray-400">{season.episode_count} Episodes</p>
            </div>
            {expandedSeason === season.season_number ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {expandedSeason === season.season_number && season.episodes && (
            <div className="border-t border-gray-700">
              {season.episodes.map((episode: Episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeClick(season.season_number, episode.episode_number)}
                  className="w-full px-6 py-4 flex gap-4 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                >
                  <div className="w-32 aspect-video rounded overflow-hidden flex-shrink-0">
                    {episode.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                        alt={episode.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-sm text-gray-400">No Preview</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-medium">
                      {episode.episode_number}. {episode.name}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{episode.overview}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}