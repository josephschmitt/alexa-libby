import RadarrAPI from 'sonarr-api'; // Radarr API is identical to radarr for now
import serverConfig from '~/api/config.js';

/**
 * @typedef {Object} MediaResult
 * @property {String} title
 * @property {String} slug
 * @property {Number} year
 * @property {String} tvdbId
 * @property {Array} images
 * @property {String} [status]
 * @property {String} [quality]
 */

let _radarr, _qualityProfiles;

export default function radarr() {
  if (!_radarr) {
    _radarr = new RadarrAPI(serverConfig('movies'));
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
  const [quality] = _qualityProfiles;
  const [rootFolderResp] = await radarr().get('rootfolder');

  return await radarr().post('movie', {
    tmdbId: movie.tvdbId,
    title: movie.title,
    titleSlug: movie.slug,
    images: movie.images,
    qualityProfileId: quality.id || 1,
    rootFolderPath: rootFolderResp.path
  });
}

async function loadQualityProfiles() {
  if (!_qualityProfiles) {
    _qualityProfiles = await radarr().get('profile');
  }
}

function mapToMediaResult(movie) {
  const quality = _qualityProfiles.find((profile) => profile.id === movie.qualityProfileId);

  return {
    title: movie.title,
    slug: movie.titleSlug,
    year: movie.year,
    tvdbId: movie.tmdbId,
    images: movie.images,
    status: movie.status,
    quality: quality ? quality.name : ''
  };
}
