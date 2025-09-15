import axios, { type AxiosInstance } from 'axios';
import type { Movie } from '../types/movie';

export const IMG_BASE = 'https://image.tmdb.org/t/p';
export const imgUrl = (path?: string | null, size: 'w200'|'w300'|'w500'|'w780'|'original'='w300') =>
  !path ? '' : (/^https?:\/\//.test(path) ? path : `${IMG_BASE}/${size}${path}`);

const V4 = import.meta.env.VITE_TMDB_TOKEN?.trim();
const V3 = import.meta.env.VITE_TMDB_API_KEY?.trim();

const headers: Record<string,string> = { Accept: 'application/json' };
if (V4) headers.Authorization = `Bearer ${V4}`;

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers,
});

export async function fetchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  const params: Record<string, any> = {
    query,
    include_adult: false,
    language: 'en-US',
    page: 1,
  };
  if (!V4 && V3) params.api_key = V3;

  const { data } = await api.get('/search/movie', { params });

  return (data?.results ?? []).map((m: any) => {
    const poster = imgUrl(m.poster_path, 'w300');
    const backdrop = imgUrl(m.backdrop_path, 'w780');
    return {
      id: String(m.id),
      title: m.title ?? m.name ?? 'Untitled',
      year: m.release_date ? String(m.release_date).slice(0, 4) : undefined,
      overview: m.overview,
      poster,
      backdrop,
      releaseDate: m.release_date || undefined,
      rating: typeof m.vote_average === 'number' ? m.vote_average : undefined,
      poster_path: m.poster_path ?? null,
      backdrop_path: m.backdrop_path ?? null,
      vote_average: m.vote_average,
    } as Movie;
  });
}
