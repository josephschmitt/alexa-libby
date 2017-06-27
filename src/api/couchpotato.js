import CouchPotatoAPI from 'couchpotato-api';
import serverConfig from '~/api/config.js';

/**
 * @typedef {Object} MovieResult
 * @property {String} title
 * @property {Number} year
 * @property {String} tmdbId
 * @property {String} [status]
 * @property {String} [quality]
 */

let _couchpotato;
export default function couchpotato() {
  if (!_couchpotato) {
    _couchpotato = new CouchPotatoAPI(serverConfig('movies'));
  }

  return _couchpotato;
}

/**
 * Returns the list of movies currently being tracked by CouchPotato.
 *
 * @param {String} [title] -- Optional title to filter the list of movies by.
 * @returns {Array<MovieResult>}
 */
export async function list(title) {
  const resp = await couchpotato().get('movie.list', {search: title});

  if (!resp) {
    return [];
  }

  const {movies} = resp;
  return Array.isArray(movies) ? movies.map(formatMovieResult) : [];
}

/**
 * Searches for a new movie not in the library.
 *
 * @param {String} query -- Search query to use when looking for the movie.
 * @returns {Array<MovieResult>}
 */
export async function search(query) {
  const resp = await couchpotato().get('movie.search', {q: query});

  if (!resp) {
    return [];
  }

  const {movies} = resp;
  return Array.isArray(movies) ? movies.map(formatMovieResult) : [];
}

/**
 * Adds a movie to the library.
 *
 * @param {MovieResult} movie -- Movie to add to the library.
 * @returns {Object} -- Couch Potato response object
 */
export async function add(movie) {
  return await couchpotato().get('movie.add', {title: movie.title, identifier: movie.imdb});
}

function formatMovieResult(movie) {
  const [release] = movie.releases;

  return {
    title: movie.title || movie.original_title || movie.titles[0],
    year: movie.info.year,
    tmdbId: movie.info.tmdb_id,
    imdb: movie.info.imdb,
    status: movie.status,
    quality: release ? release.quality : null
  };
}
