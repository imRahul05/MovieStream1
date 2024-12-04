import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { fetchTrailer } from '../services/video';
import type { VideoResult } from '../types/movie';

interface VideoPlayerProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  videoUrl: string;
  posterPath?: string;
  imdbId?: string;
}

export default function VideoPlayer({ mediaId, mediaType, videoUrl, posterPath, imdbId }: VideoPlayerProps) {
  const [trailer, setTrailer] = useState<VideoResult | null>(null);
  const [showTrailer, setShowTrailer] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const loadTrailer = async () => {
      const trailerData = await fetchTrailer(mediaId);
      setTrailer(trailerData);
    };
    loadTrailer();
  }, [mediaId]);

  const handleWatchClick = () => {
    setShowTrailer(false);
    setShowVideo(true);
  };

  const handleTrailerClick = () => {
    setShowVideo(false);
    setShowTrailer(true);
  };

  const getEmbedUrl = () => {
    // Use TMDB ID directly for vidsrc.xyz
    return `https://vidsrc.xyz/embed/movie?tmdb=${mediaId}`;
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {showVideo ? (
        <div className="absolute inset-0">
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </div>
      ) : showTrailer && trailer ? (
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : (
        posterPath && (
          <img
            src={`https://image.tmdb.org/t/p/original${posterPath}`}
            alt="Media poster"
            className="w-full h-full object-cover"
          />
        )
      )}

      <div className="absolute bottom-4 left-4 flex gap-4">
        {!showVideo && (
          <button
            onClick={handleWatchClick}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Watch {mediaType === 'movie' ? 'Movie' : 'Episode'}</span>
          </button>
        )}
        {trailer && !showTrailer && (
          <button
            onClick={handleTrailerClick}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Watch Trailer</span>
          </button>
        )}
      </div>
    </div>
  );
}