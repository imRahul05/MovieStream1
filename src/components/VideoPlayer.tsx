import { useState, useEffect } from 'react';
import { Play, Film, Clapperboard, Tv } from 'lucide-react';
import { fetchTrailer, getVideoUrl } from '../services/video';
import type { VideoResult } from '../types/movie';
import { focusRing } from './details/dialogStyles';

interface VideoPlayerProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  videoUrl: string;
  posterPath?: string;
  imdbId?: string;
}

type Mode = 'poster' | 'trailer' | 'stream';

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

export default function VideoPlayer({
  mediaId,
  mediaType,
  videoUrl,
  posterPath,
}: VideoPlayerProps) {
  const [trailer, setTrailer] = useState<VideoResult | null>(null);
  const [mode, setMode] = useState<Mode>('poster');
  const [loadedSrc, setLoadedSrc] = useState('');
  const [imgFailed, setImgFailed] = useState(false);
  const [prevUrl, setPrevUrl] = useState(videoUrl);

  // Picking another episode jumps straight into the stream.
  if (prevUrl !== videoUrl) {
    setPrevUrl(videoUrl);
    setMode('stream');
  }

  useEffect(() => {
    let cancelled = false;
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
    videoUrl || getVideoUrl(mediaType, mediaId);
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
    : '';
  const activeSrc = mode === 'stream' ? streamUrl : mode === 'trailer' ? trailerUrl : '';
  const isEmbed = mode !== 'poster' && !!activeSrc;
  const loaded = isEmbed && loadedSrc === activeSrc;
  const status = !isEmbed ? 'Ready' : loaded ? 'Live' : 'Connecting';
  const showPoster = !!posterPath && !imgFailed;

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ease-(--ease-out-expo) cursor-pointer ${focusRing} ${
      active
        ? 'bg-brand text-brand-foreground shadow-[0_0_18px_var(--brand-glow)]'
        : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
    }`;

  return (
    <div>
      <div className="grain relative aspect-video w-full overflow-hidden bg-black sm:rounded-2xl sm:border sm:border-border-strong">
        {isEmbed && (
          <>
            {/* Loading skeleton sits behind the iframe */}
            <div className="skeleton absolute inset-0" aria-hidden="true" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" aria-hidden="true">
              <span className="blip-dot" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Connecting
              </span>
            </div>
            <iframe
              key={activeSrc}
              src={activeSrc}
              title={mode === 'trailer' ? trailer?.name || 'Official Trailer' : 'Movie Stream Player'}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              allowFullScreen
              allow={IFRAME_ALLOW}
              referrerPolicy={mode === 'stream' ? 'strict-origin-when-cross-origin' : undefined}
              onLoad={() => setLoadedSrc(activeSrc)}
            />
          </>
        )}

        {!isEmbed && (
          <>
            {showPoster ? (
              <img
                src={`https://image.tmdb.org/t/p/w1280${posterPath}`}
                alt=""
                className="animate-ken-burns h-full w-full object-cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_10%,var(--brand-soft),transparent_60%),linear-gradient(135deg,#15151b,#050507)]">
                <div className="absolute inset-y-0 w-1/4 bg-linear-to-r from-transparent via-white/6 to-transparent animate-scan" aria-hidden="true" />
                <Film className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-white/15" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/30" />

            <button
              type="button"
              onClick={() => setMode('stream')}
              aria-label={`Watch ${mediaType === 'movie' ? 'movie' : 'episode'}`}
              className={`group/play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm ${focusRing} animate-pop`}
            >
              <span className="relative grid size-16 place-items-center rounded-sm bg-brand text-brand-foreground shadow-[0_0_44px_var(--brand-glow)] transition-transform duration-300 ease-(--ease-spring) group-hover/play:scale-110 sm:size-20">
                <span className="animate-blip absolute inset-0 rounded-[inherit] bg-brand" aria-hidden="true" />
                <Play className="relative h-6 w-6 translate-x-0.5 fill-current sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
            </button>

            <p className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 sm:bottom-4 sm:left-5">
              Press play
            </p>
          </>
        )}
      </div>

      {/* Status + source switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3 sm:px-1">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" role="status">
          {status === 'Ready' ? (
            <span className="inline-block size-2 rounded-full bg-muted-foreground/60" aria-hidden="true" />
          ) : (
            <span className="blip-dot" aria-hidden="true" />
          )}
          <span className="text-foreground">{status}</span>
          <span aria-hidden="true">/</span>
          <span>{mode === 'trailer' ? 'Trailer' : mode === 'stream' ? 'Stream' : 'Preview'}</span>
        </div>

        <div
          role="group"
          aria-label="Playback source"
          className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-elevated p-1"
        >
          <button
            type="button"
            aria-pressed={mode === 'stream'}
            onClick={() => setMode('stream')}
            className={chip(mode === 'stream')}
          >
            <Tv className="h-3.5 w-3.5" aria-hidden="true" />
            {mediaType === 'movie' ? 'Movie' : 'Episode'}
          </button>
          {trailer && (
            <button
              type="button"
              aria-pressed={mode === 'trailer'}
              onClick={() => setMode('trailer')}
              className={chip(mode === 'trailer')}
            >
              <Clapperboard className="h-3.5 w-3.5" aria-hidden="true" />
              Trailer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
