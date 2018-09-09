import config from 'config';
import OmbiAPI from './OmbiApi.js';

import serverConfig from '~/api/config.js';
import {PROVIDER_TYPE} from '~/api/getProvider.js';

/**
 * @typedef {Object} MediaResult
 * @property {String} title
 * @property {String} slug
 * @property {Number} year
 * @property {String} tmdbId
 * @property {String} imdbId
 * @property {Array} images
 * @property {String} [status]
 * @property {String} [quality]
 */

let _ombi, _qualityProfiles;

export default function ombi() {
  if (!_ombi) {
    _ombi = new OmbiAPI(serverConfig(PROVIDER_TYPE.MOVIES));
  }

  return _ombi;
}

/**
 * Returns the list of movies currently being tracked by radarr.
 *
 * @param {String} [title] -- Optional title to filter the list of movies by.
 * @returns {Array<MediaResult>}
 */
export async function list(title) {
  console.log({"Message": "Enter Ombi List Function.", "title": title})
  await loadQualityProfiles();

  const resp = await ombi().get('Request/movie');
  const movies = resp.map(mapToMediaResult);

  if (title) {
    return movies.filter((movie) => {
      return movie.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
    });
  }

  return movies;
}

/**
 * Searches for a new movie not in the library.
 *
 * @param {String} query -- Search query to use when looking for the movie.
 * @returns {Array<MediaResult>}
 */
export async function search(query) {
  await loadQualityProfiles();
  const resp = await ombi().get('Search/movie/' + query);

  return resp.map(mapToMediaResult);
}

/**
 * Adds a movie to the library.
 *
 * @param {MediaResult} movie -- movie to add to the library.
 * @returns {Object} -- radarr response object
 */
export async function add(movie) {
  const result = await ombi().post('Request/movie', {theMovieDbId: movie.tmdbId});
  if (result.result == true && result.isError == false){
    return result;
  }
  else {
    throw new Error(result.errorMessage);
  }
}

async function loadQualityProfiles() {
  if (!_qualityProfiles) {
    _qualityProfiles = await ombi().get('Radarr/Profiles');
  }

  return _qualityProfiles;
}

function mapToMediaResult(movie) {
  const preferredQuality = getPreferredQuality();
  const quality = _qualityProfiles.find((profile) => {
    return profile.id === movie.qualityOverride || profile.name === preferredQuality;
  });

  const _images = [
    {
      "coverType": "poster",
      "url": "https://image.tmdb.org/t/p/w300" + movie.posterPath
    },
    {
      "coverType": "banner",
      "url": "https://image.tmdb.org/t/p/w300" + movie.background
    }
  ];

  return {
    title: movie.title,
    slug: movie.overview,
    year: movie.releaseDate ? movie.releaseDate.split('-')[0] : 'unknown',
    tmdbId: movie.theMovieDbId,
    imdbId: movie.imdbId,
    images: _images,
    status: movie.status,
    quality: quality ? quality.name : 'Any'
  };
}

function getPreferredQuality() {
  const path = `alexa-libby.${PROVIDER_TYPE.MOVIES}.quality`;

  if (config.has(path)) {
    return config.get(path);
  }

  return null;
}
