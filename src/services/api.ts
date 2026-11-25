import { FALLBACK_MOVIES, FALLBACK_TOP_RATED, FALLBACK_TRENDING } from '../data/fallbackMovies';
import type { Movie, MovieDetails } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const hasTmdbConfig = Boolean(API_KEY || ACCESS_TOKEN);

const getHeaders = (): HeadersInit => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ACCESS_TOKEN) {
    h.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }
  return h;
};

const apiKeyParam = () => (API_KEY ? `api_key=${API_KEY}` : '');

export const fetchTrending = async (): Promise<{ results: Movie[] }> => {
  if (!hasTmdbConfig) return { results: FALLBACK_TRENDING };
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?${apiKeyParam()}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('TMDB trending request failed');
    const data = await response.json();
    return data?.results?.length ? data : { results: FALLBACK_TRENDING };
  } catch {
    return { results: FALLBACK_TRENDING };
  }
};

export const fetchTopRated = async (): Promise<{ results: Movie[] }> => {
  if (!hasTmdbConfig) return { results: FALLBACK_TOP_RATED };
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?${apiKeyParam()}&language=en-US&page=1`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('TMDB top_rated request failed');
    const data = await response.json();
    return data?.results?.length ? data : { results: FALLBACK_TOP_RATED };
  } catch {
    return { results: FALLBACK_TOP_RATED };
  }
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  const fallback = FALLBACK_MOVIES.find((m) => String(m.id) === String(id));
  if (!hasTmdbConfig) {
    if (fallback) return fallback;
    return FALLBACK_MOVIES[0];
  }
  try {
    const [detailsRes, providersRes, externalRes] = await Promise.all([
      fetch(
        `${BASE_URL}/movie/${id}?${apiKeyParam()}&append_to_response=credits,videos,reviews`,
        { headers: getHeaders() }
      ),
      fetch(`${BASE_URL}/movie/${id}/watch/providers?${apiKeyParam()}`, {
        headers: getHeaders(),
      }),
      fetch(`${BASE_URL}/movie/${id}/external_ids?${apiKeyParam()}`, {
        headers: getHeaders(),
      }),
    ]);

    if (!detailsRes.ok) throw new Error('Failed to load movie details');
    const [details, watchProviders, externalIds] = await Promise.all([
      detailsRes.json(),
      providersRes.ok ? providersRes.json() : Promise.resolve({ results: {} }),
      externalRes.ok ? externalRes.json() : Promise.resolve({}),
    ]);

    return {
      ...details,
      credits: details.credits ?? { cast: [] },
      videos: details.videos ?? { results: [] },
      reviews: details.reviews ?? { results: [] },
      genres: details.genres ?? [],
      watchProviders: watchProviders?.results?.US || null,
      imdb_id: externalIds?.imdb_id,
    };
  } catch {
    return fallback ?? FALLBACK_MOVIES[0];
  }
};

export const searchMovies = async (query: string): Promise<{ results: Movie[] }> => {
  const q = query.trim();
  if (!q) return { results: [] };

  const localFilter = () => {
    const lower = q.toLowerCase();
    return {
      results: FALLBACK_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(lower) ||
          m.overview.toLowerCase().includes(lower) ||
          m.genres.some((g) => g.name.toLowerCase().includes(lower))
      ),
    };
  };

  if (!hasTmdbConfig) return localFilter();

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?${apiKeyParam()}&query=${encodeURIComponent(q)}&language=en-US&page=1`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('Search request failed');
    const data = await response.json();
    return { results: data?.results ?? [] };
  } catch {
    return localFilter();
  }
};

export const discoverMovies = async (
  params: Record<string, string>
): Promise<{ results: Movie[] }> => {
  if (!hasTmdbConfig) {
    const genreId = params.with_genres ? Number(params.with_genres) : null;
    const filtered = genreId
      ? FALLBACK_MOVIES.filter((m) => m.genre_ids.includes(genreId))
      : FALLBACK_MOVIES;
    return { results: filtered };
  }
  try {
    const queryParams = new URLSearchParams({
      ...params,
      ...(API_KEY ? { api_key: API_KEY } : {}),
      include_adult: 'false',
    });

    const response = await fetch(`${BASE_URL}/discover/movie?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Discover request failed');
    return response.json();
  } catch {
    return { results: FALLBACK_MOVIES };
  }
};

export const addMovieReview = async (
  movieId: string,
  review: { content: string; rating: number }
) => {
  const storageKey = `movie-${movieId}-reviews`;
  const existingReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const newReview = {
    id: Date.now().toString(),
    author: 'You',
    content: review.content,
    rating: review.rating,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify([newReview, ...existingReviews]));
  return newReview;
};

export const getLocalReviews = (movieId: string) => {
  const storageKey = `movie-${movieId}-reviews`;
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
};