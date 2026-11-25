import type { Movie, MovieDetails } from '../types/movie';

export const GENRES: { id: number; name: string }[] = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Sci-Fi' },
  { id: 18, name: 'Drama' },
  { id: 53, name: 'Thriller' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
];

export const FALLBACK_MOVIES: MovieDetails[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    overview:
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    vote_average: 8.3,
    release_date: '2024-02-27',
    genre_ids: [878, 12],
    runtime: 167,
    imdb_id: 'tt15239678',
    genres: [
      { id: 878, name: 'Sci-Fi' },
      { id: 12, name: 'Adventure' },
    ],
    credits: {
      cast: [
        { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
        { id: 505710, name: 'Zendaya', character: 'Chani', profile_path: '/3WdOloHpjtjL96uVOhFRRCcYSwq.jpg' },
        { id: 933238, name: 'Rebecca Ferguson', character: 'Jessica', profile_path: '/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
        { id: 3810, name: 'Javier Bardem', character: 'Stilgar', profile_path: '/IShnFg6ijwhpBu29dFBd9屋.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v1', key: 'Way9Dexny3w', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: {
      results: [
        {
          id: 'r1',
          author: 'CinemaScope',
          content: 'A monumental sci-fi epic with breathtaking sound design, towering scale, and unforgettable visuals.',
          created_at: '2024-03-04T12:00:00.000Z',
          rating: 5,
        },
      ],
    },
    watchProviders: {
      flatrate: [{ provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtLckROUN.jpg' }],
      rent: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSC0MA082EL6HLCW3GalykFD.jpg' }],
    },
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    overview:
      'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II and the moral fallout that followed.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    vote_average: 8.1,
    release_date: '2023-07-19',
    genre_ids: [18, 53],
    runtime: 181,
    imdb_id: 'tt15398776',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' },
    ],
    credits: {
      cast: [
        { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: '/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg' },
        { id: 5081, name: 'Emily Blunt', character: 'Kitty Oppenheimer', profile_path: '/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg' },
        { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: '/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v2', key: 'uYPbbksJxIg', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: {
      results: [
        {
          id: 'r2',
          author: 'ReelReview',
          content: 'Relentless pacing and towering performances turn a biographical drama into a white-knuckle thriller.',
          created_at: '2023-07-25T15:30:00.000Z',
          rating: 5,
        },
      ],
    },
    watchProviders: {
      flatrate: [{ provider_id: 386, provider_name: 'Peacock', logo_path: '/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg' }],
      rent: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSC0MA082EL6HLCW3GalykFD.jpg' }],
    },
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    vote_average: 8.4,
    release_date: '2014-11-05',
    genre_ids: [12, 18, 878],
    runtime: 169,
    imdb_id: 'tt0816692',
    genres: [
      { id: 12, name: 'Adventure' },
      { id: 18, name: 'Drama' },
      { id: 878, name: 'Sci-Fi' },
    ],
    credits: {
      cast: [
        { id: 10297, name: 'Matthew McConaughey', character: 'Cooper', profile_path: '/e9ZHRY5SmELGN6Wi1dQ89235621.jpg' },
        { id: 1813, name: 'Anne Hathaway', character: 'Brand', profile_path: '/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg' },
        { id: 83002, name: 'Jessica Chastain', character: 'Murph', profile_path: '/lodMzLbudZQPczvOFTsKzKfwPFl.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v3', key: 'zSWdZVtXT7E', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 531, provider_name: 'Paramount+', logo_path: '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg' }],
    },
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview:
      'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    vote_average: 8.4,
    release_date: '2023-05-31',
    genre_ids: [16, 28, 12, 878],
    runtime: 140,
    imdb_id: 'tt9362722',
    genres: [
      { id: 16, name: 'Animation' },
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
    ],
    credits: {
      cast: [
        { id: 587506, name: 'Shameik Moore', character: 'Miles Morales', profile_path: '/uJNaSTsfBOvtFWsPP23zNthknsB.jpg' },
        { id: 130640, name: 'Hailee Steinfeld', character: 'Gwen Stacy', profile_path: '/q4UpZMEuvminnzkWhykbdoy483.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v4', key: 'cqGjhVJWtEg', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
    },
  },
  {
    id: 155,
    title: 'The Dark Knight',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    vote_average: 8.5,
    release_date: '2008-07-16',
    genre_ids: [18, 28, 80, 53],
    runtime: 152,
    imdb_id: 'tt0468569',
    genres: [
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' },
      { id: 18, name: 'Drama' },
    ],
    credits: {
      cast: [
        { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne', profile_path: '/qCpZn2e3dimwbryLnqxZuI88PTi.jpg' },
        { id: 1810, name: 'Heath Ledger', character: 'Joker', profile_path: '/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v5', key: 'EXeTwQWrcwY', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtLckROUN.jpg' }],
    },
  },
  {
    id: 496243,
    title: 'Parasite',
    overview:
      'All unemployed, Ki-taek’s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
    vote_average: 8.5,
    release_date: '2019-05-30',
    genre_ids: [35, 53, 18],
    runtime: 133,
    imdb_id: 'tt6751668',
    genres: [
      { id: 53, name: 'Thriller' },
      { id: 18, name: 'Drama' },
      { id: 35, name: 'Comedy' },
    ],
    credits: {
      cast: [
        { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek', profile_path: '/dyinEsq2pxlOW94d5C8b5q2x3wW.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v6', key: '5xH0HfJHsaY', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 15, provider_name: 'Hulu', logo_path: '/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg' }],
    },
  },
  {
    id: 335984,
    title: 'Blade Runner 2049',
    overview:
      'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what’s left of society into chaos.',
    poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: '/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg',
    vote_average: 7.6,
    release_date: '2017-10-04',
    genre_ids: [878, 18],
    runtime: 164,
    imdb_id: 'tt1856101',
    genres: [
      { id: 878, name: 'Sci-Fi' },
      { id: 18, name: 'Drama' },
    ],
    credits: {
      cast: [
        { id: 30614, name: 'Ryan Gosling', character: 'Officer K', profile_path: '/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg' },
        { id: 3, name: 'Harrison Ford', character: 'Rick Deckard', profile_path: '/ActhM39szMahiyJCWvaNzTOTcfD.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v7', key: 'gCcx85zbxz4', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      rent: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSC0MA082EL6HLCW3GalykFD.jpg' }],
    },
  },
  {
    id: 27205,
    title: 'Inception',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    vote_average: 8.4,
    release_date: '2010-07-15',
    genre_ids: [28, 878, 12],
    runtime: 148,
    imdb_id: 'tt1375666',
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Sci-Fi' },
      { id: 12, name: 'Adventure' },
    ],
    credits: {
      cast: [
        { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v8', key: 'YoHD9XEInc0', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
    },
  },
  {
    id: 278,
    title: 'The Shawshank Redemption',
    overview:
      'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg',
    vote_average: 8.7,
    release_date: '1994-09-23',
    genre_ids: [18, 80],
    runtime: 142,
    imdb_id: 'tt0111161',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
    credits: {
      cast: [
        { id: 504, name: 'Tim Robbins', character: 'Andy Dufresne', profile_path: '/A4fHNLX73EQs78f2G6ObfKZnvp4.jpg' },
        { id: 192, name: 'Morgan Freeman', character: 'Red', profile_path: '/jPsLqiYGSofU4s6BjrxnefMfabb.jpg' },
      ],
    },
    videos: {
      results: [
        { id: 'v9', key: 'PLl99DlL6b4', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtLckROUN.jpg' }],
    },
  },
  {
    id: 129,
    title: 'Spirited Away',
    overview:
      'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/m4TUa2ciEWSlk37rOsjiSIvZDXE.jpg',
    vote_average: 8.5,
    release_date: '2001-07-20',
    genre_ids: [16, 14, 12],
    runtime: 125,
    imdb_id: 'tt0245429',
    genres: [
      { id: 16, name: 'Animation' },
      { id: 14, name: 'Fantasy' },
    ],
    credits: {
      cast: [],
    },
    videos: {
      results: [
        { id: 'v10', key: 'ByXuk9QqQkk', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer' },
      ],
    },
    reviews: { results: [] },
    watchProviders: {
      flatrate: [{ provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtLckROUN.jpg' }],
    },
  },
];

export const FALLBACK_TRENDING: Movie[] = FALLBACK_MOVIES;
export const FALLBACK_TOP_RATED: Movie[] = [...FALLBACK_MOVIES].sort(
  (a, b) => b.vote_average - a.vote_average
);
