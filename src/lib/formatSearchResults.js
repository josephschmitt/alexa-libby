export default function formatSearchResults(movies) {
  if (movies) {
    return movies.map((movie) => {
      return {
        original_title: movie.original_title,
        in_library: movie.in_library,
        year: movie.year,
        titles: movie.titles,
        imdb: movie.imdb
      };
    });
  }

  return [];
}
