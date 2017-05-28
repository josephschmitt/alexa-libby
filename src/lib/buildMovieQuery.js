import parseDate from '~/lib/parseDate.js';

export default function buildMovieQuery(req) {
  const movieName = req.slot('movieName');
  const releaseDate = parseDate(req.slot('releaseDate'));

  return releaseDate ? `${movieName} ${releaseDate.year}` : movieName;
}
