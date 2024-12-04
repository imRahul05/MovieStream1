export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  imdb_id?: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  air_date: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  episodes?: Episode[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos: {
    results: VideoResult[];
  };
  reviews: {
    results: {
      id: string;
      author: string;
      content: string;
      created_at: string;
      rating?: number;
    }[];
  };
  watchProviders: {
    flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
    rent?: { provider_id: number; provider_name: string; logo_path: string }[];
    buy?: { provider_id: number; provider_name: string; logo_path: string }[];
  } | null;
  seasons?: Season[];
  imdb_id?: string;
}