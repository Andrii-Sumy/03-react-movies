import axios, { type AxiosInstance } from 'axios';
import type { Movie } from '../types/movie';

export const IMG_BASE = 'https://image.tmdb.org/t/p';
export const imgUrl = (
  path: string | null,
  size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w300'
) => (!path ? '' : `${IMG_BASE}/${size}${path}`);

const V4 = import.meta.env.VITE_TMDB_TOKEN?.trim();
const V3 = import.meta.env.VITE_TMDB_API_KEY?.trim();

const headers: Record<string, string> = { Accept: 'application/json' };
if (V4) headers.Authorization = `Bearer ${V4}`;

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers,
});

interface SearchResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  const params: Record<string, any> = {
    query,
    include_adult: false,
    language: 'en-US',
    page: 1,
  };
  if (!V4 && V3) params.api_key = V3;

  const { data } = await api.get<SearchResponse>('/search/movie', { params });

  return data.results;
}
