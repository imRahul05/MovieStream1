const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const fetchTrending = async () => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    { headers }
  );
  return response.json();
};

export const fetchTopRated = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    { headers }
  );
  return response.json();
};

export const fetchMovieDetails = async (id: string) => {
  const [details, watchProviders, externalIds] = await Promise.all([
    fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,reviews`,
      { headers }
    ).then(res => res.json()),
    fetch(
      `${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`,
      { headers }
    ).then(res => res.json()),
    fetch(
      `${BASE_URL}/movie/${id}/external_ids?api_key=${API_KEY}`,
      { headers }
    ).then(res => res.json()),
  ]);

  return {
    ...details,
    watchProviders: watchProviders.results?.US || null,
    imdb_id: externalIds.imdb_id,
  };
};

export const searchMovies = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`,
    { headers }
  );
  return response.json();
};

export const discoverMovies = async (params: Record<string, string>) => {
  const queryParams = new URLSearchParams({
    ...params,
    api_key: API_KEY,
    include_adult: 'false',
  });
  
  const response = await fetch(`${BASE_URL}/discover/movie?${queryParams}`, {
    headers,
  });
  return response.json();
};

export const addMovieReview = async (movieId: string, review: { content: string; rating: number }) => {
  const storageKey = `movie-${movieId}-reviews`;
  const existingReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const newReview = {
    id: Date.now().toString(),
    author: 'User',
    content: review.content,
    rating: review.rating,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify([newReview, ...existingReviews]));
  return newReview;
};

export const getLocalReviews = (movieId: string) => {
  const storageKey = `movie-${movieId}-reviews`;
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
};