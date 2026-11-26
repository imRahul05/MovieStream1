/**
 * Embed URL patterns for the video player.
 * Placeholders: {id} (TMDB id), {season}, {episode}.
 */
export interface VideoSource {
  label: string;
  movie: string;
  tv: string;
  tvEpisode: string;
}

export const VIDEO_SOURCES = {
  vidsrc: {
    label: 'VidSrc',
    movie: 'https://vidsrc.xyz/embed/movie?tmdb={id}',
    tv: 'https://vidsrc.xyz/embed/tv?tmdb={id}',
    tvEpisode: 'https://vidsrc.xyz/embed/tv?tmdb={id}&season={season}&episode={episode}',
  },
} satisfies Record<string, VideoSource>;

export type VideoSourceId = keyof typeof VIDEO_SOURCES;

export const DEFAULT_VIDEO_SOURCE: VideoSourceId = 'vidsrc';
