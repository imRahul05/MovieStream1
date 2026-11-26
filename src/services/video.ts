import { FALLBACK_MOVIES } from '../data/fallbackMovies';
import type { VideoResult } from '../types/movie';
import {
  DEFAULT_VIDEO_SOURCE,
  VIDEO_SOURCES,
  type VideoSourceId,
} from '../config/videoSources';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function fetchTrailer(movieId: string): Promise<VideoResult | null> {
  const fallbackMovie = FALLBACK_MOVIES.find((m) => String(m.id) === String(movieId));
  if (!API_KEY && !ACCESS_TOKEN) {
    return fallbackMovie?.videos.results[0] ?? null;
  }

  try {
    const headers: Record<string, string> = {};
    if (ACCESS_TOKEN) headers.Authorization = `Bearer ${ACCESS_TOKEN}`;

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos${API_KEY ? `?api_key=${API_KEY}` : ''}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch trailer data');
    }

    const data = await response.json();

    // Filter for YouTube trailers, prioritizing official trailers
    const trailers = (data.results ?? []).filter(
      (video: VideoResult) =>
        video.site === 'YouTube' &&
        (video.type === 'Trailer' || video.type === 'Teaser')
    );

    // Sort to prioritize official trailers over teasers
    trailers.sort((a: VideoResult, b: VideoResult) => {
      if (a.type === 'Trailer' && b.type === 'Teaser') return -1;
      if (a.type === 'Teaser' && b.type === 'Trailer') return 1;
      return 0;
    });

    return trailers.length > 0 ? trailers[0] : (fallbackMovie?.videos.results[0] ?? null);
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return fallbackMovie?.videos.results[0] ?? null;
  }
}

export function getVideoUrl(
  type: 'movie' | 'tv',
  id: string | number,
  options?: { season?: number; episode?: number; source?: VideoSourceId }
) {
  const source = VIDEO_SOURCES[options?.source ?? DEFAULT_VIDEO_SOURCE];
  const pattern =
    type === 'movie'
      ? source.movie
      : options?.season && options?.episode
        ? source.tvEpisode
        : source.tv;

  return pattern
    .replace('{id}', String(id))
    .replace('{season}', String(options?.season ?? ''))
    .replace('{episode}', String(options?.episode ?? ''));
}
