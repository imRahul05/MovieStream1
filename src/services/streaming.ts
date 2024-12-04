const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

export const fetchStreamingInfo = async (tmdbId: string) => {
  try {
    const response = await fetch(
      `https://streaming-availability.p.rapidapi.com/get/basic?country=us&tmdb_id=movie/${tmdbId}`,
      {
        headers: {
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.error('Failed to fetch streaming info:', error);
    return null;
  }
};