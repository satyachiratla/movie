import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const dummyMovies = [
    {
      id: 1,
      title: "Game Of Thrones",
      openingText: "Nine noble families fought to win the Iron Throne.",
      releaseDate: "2011-05-18",
    },
    {
      id: 2,
      title: "Stranger Things",
      openingText: "This is the second opening text of the movie",
      releaseDate: "2016-05-19",
    },
  ];

  const [showForm, setShowForm] = useState(false);

  const [movies, setMovies] = useState(dummyMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //const api_key = "https://api.themoviedb.org/3/tv/popular?api_key=de9929f37ff02f5324c8210f01ea2eff";
  //const api = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=de9929f37ff02f5324c8210f01ea2eff"
  const api_key = 'https://movie-1cdc7-default-rtdb.firebaseio.com/movies.json'

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(api_key);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      let loadedMovies = []

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchMoviesHandler()
  }, [fetchMoviesHandler])

  const addMovieHandler = async (movie) => {
    const response = await fetch(api_key, {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": 'application/json'
      }
    })
    const data = await response.json();
    console.log(data);
  }

  const formShowHandler = () => {
    setShowForm(true);
  }

  const formCloseHandler = () => {
    setShowForm(false);
  }

  return (
    <React.Fragment>
      <section>
      { showForm && <AddMovie onAddMovie={addMovieHandler} onClose={formCloseHandler} /> }
      { !showForm && <button onClick={formShowHandler}>Add a Movie</button>}
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found No Movies!</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
