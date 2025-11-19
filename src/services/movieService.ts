import axios from "axios";
import type { Movie } from "../types/movie";

const TMBD_BASE_URL = "https://api.themoviedb.org/3";
const TMBD_TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

interface FetchMovieParams {
  query: string;
  include_adult?: boolean;
  language?: string;
  primary_release_year?: string;
  page?: number;
  region?: string;
  year?: string;
}

export interface FetchMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  params: FetchMovieParams
): Promise<FetchMovieResponse> {
  const response = await axios.get<FetchMovieResponse>(
    `${TMBD_BASE_URL}/search/movie`,
    { params, headers: { Authorization: `Bearer ${TMBD_TOKEN}` } }
  );
  return response.data;
}
