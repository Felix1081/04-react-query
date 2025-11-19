import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import {
  fetchMovies,
  type FetchMovieResponse,
} from "../../services/movieService";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setPage] = useState(1);
  const {
    data: movies,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<FetchMovieResponse>({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies({ query: searchQuery, page: currentPage }),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && movies?.results.length === 0) {
      toast.error("No movies found. Please try a different query.");
    }
  }, [isSuccess, movies]);

  const handleSearchSubmit = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const totalPages = movies?.total_pages ?? 0;

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies?.results && movies.results.length > 0 && (
        <MovieGrid movies={movies.results} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
