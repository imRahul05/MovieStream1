import { VideoResult } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchTrailer(movieId: string): Promise<VideoResult | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trailer data');
    }
    
    const data = await response.json();
    
    // Filter for YouTube trailers, prioritizing official trailers
    const trailers = data.results.filter((video: VideoResult) => 
      video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    // Sort to prioritize official trailers over teasers
    trailers.sort((a: VideoResult, b: VideoResult) => {
      if (a.type === 'Trailer' && b.type === 'Teaser') return -1;
      if (a.type === 'Teaser' && b.type === 'Trailer') return 1;
      return 0;
    });
    
    return trailers.length > 0 ? trailers[0] : null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
}

export function getVideoUrl(type: 'movie' | 'tv', id: string | number) {
  // Always use TMDB ID for consistency
  if (type === 'movie') {
    return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
  }
  return `https://vidsrc.xyz/embed/tv?tmdb=${id}`;
}