export interface Movie {
  id: string;
  title: string;
  year?: string;
  overview?: string;

  poster?: string;
  backdrop?: string;

  releaseDate?: string;
  rating?: number;

  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
}
