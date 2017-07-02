import config from 'config';
import RadarrAPI from 'sonarr-api'; // Radarr API is identical to radarr for now

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

let _radarr, _qualityProfiles;

export default function radarr() {
  if (!_radarr) {
    _radarr = new RadarrAPI(serverConfig(PROVIDER_TYPE.MOVIES));
  }

  return _radarr;
}

/**
 * Returns the list of movies currently being tracked by radarr.
 *
 * @param {String} [title] -- Optional title to filter the list of movies by.
 * @returns {Array<MediaResult>}
 */
export async function list(title) {
  await loadQualityProfiles();

  const resp = await radarr().get('movie');
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
  const resp = await radarr().get('movies/lookup', {term: query});

  return resp.map(mapToMediaResult);
}

/**
 * Adds a movie to the library.
 *
 * @param {MediaResult} movie -- movie to add to the library.
 * @returns {Object} -- radarr response object
 */
export async function add(movie) {
  const [rootFolderResp] = await radarr().get('rootfolder');
  const preferredQuality = config.get(`alexa-libby.${PROVIDER_TYPE.MOVIES}.quality`);
  const qualities = await loadQualityProfiles();
  const quality = qualities.find((qt) => {
    return qt.name === preferredQuality;
  });

  return await radarr().post('movie', {
    tmdbId: movie.tmdbId,
    title: movie.title,
    titleSlug: movie.slug,
    images: movie.images,
    qualityProfileId: quality ? quality.id : 1, // Default to 'Any' if no profile set in config
    rootFolderPath: rootFolderResp.path,
    addOptions: {
      searchForMovie: true
    }
  });
}

async function loadQualityProfiles() {
  if (!_qualityProfiles) {
    _qualityProfiles = await radarr().get('profile');
  }

  return _qualityProfiles;
}

function mapToMediaResult(movie) {
  const preferredQuality = config.get(`alexa-libby.${PROVIDER_TYPE.MOVIES}.quality`);
  const quality = _qualityProfiles.find((profile) => {
    return profile.id === movie.qualityProfileId || profile.name === preferredQuality;
  });

  return {
    title: movie.title,
    slug: movie.titleSlug,
    year: movie.year,
    tmdbId: movie.tmdbId,
    imdbId: movie.imdbId,
    images: movie.images,
    status: movie.status,
    quality: quality ? quality.name : 'Any'
  };
}
