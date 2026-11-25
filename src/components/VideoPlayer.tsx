import { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { fetchTrailer } from '../services/video';
import type { VideoResult } from '../types/movie';

interface VideoPlayerProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  videoUrl: string;
  posterPath?: string;
  imdbId?: string;
}

export default function VideoPlayer({
  mediaId,
  mediaType,
  videoUrl,
  posterPath,
}: VideoPlayerProps) {
  const [trailer, setTrailer] = useState<VideoResult | null>(null);
  const [mode, setMode] = useState<'poster' | 'trailer' | 'stream'>('poster');

  useEffect(() => {
    let cancelled = false;
    setMode('poster');
    const loadTrailer = async () => {
      const trailerData = await fetchTrailer(mediaId);
      if (!cancelled) setTrailer(trailerData);
    };
    loadTrailer();
    return () => {
      cancelled = true;
    };
  }, [mediaId]);

  const streamUrl =
    videoUrl || `https://vidsrc.xyz/embed/${mediaType}?tmdb=${mediaId}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {mode === 'stream' ? (
        <iframe
          src={streamUrl}
          title="Movie Stream Player"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      ) : mode === 'trailer' && trailer ? (
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
          title={trailer.name || 'Official Trailer'}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <>
          {posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/original${posterPath}`}
              alt="Backdrop preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-neutral-500">
              <Film className="h-12 w-12 opacity-40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </>
      )}

      {/* Playback Mode Controls */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 flex flex-wrap items-center gap-2.5">
        {mode !== 'stream' && (
          <button
            type="button"
            onClick={() => setMode('stream')}
            className="inline-flex items-center gap-2 rounded-full bg-brand hover:bg-brand-hover px-5 py-2.5 text-xs sm:text-sm font-semibold text-brand-foreground shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Watch {mediaType === 'movie' ? 'Movie' : 'Episode'}</span>
          </button>
        )}
        {trailer && mode !== 'trailer' && (
          <button
            type="button"
            onClick={() => setMode('trailer')}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/65 hover:bg-black/85 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <Film className="h-4 w-4" />
            <span>Play Trailer</span>
          </button>
        )}
      </div>
    </div>
  );
}