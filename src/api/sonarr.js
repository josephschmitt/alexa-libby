import SonarrAPI from 'sonarr-api';
import serverConfig from '~/api/config.js';

/**
 * @typedef {Object} MediaResult
 * @property {String} title
 * @property {String} slug
 * @property {Number} year
 * @property {String} tvdbId
 * @property {String} imdbId
 * @property {Array} images
 * @property {String} [status]
 * @property {String} [quality]
 */

let _sonarr, _qualityProfiles;

export default function sonarr() {
  if (!_sonarr) {
    _sonarr = new SonarrAPI(serverConfig('shows'));
  }

  return _sonarr;
}

/**
 * Returns the list of shows currently being tracked by sonarr.
 *
 * @param {String} [title] -- Optional title to filter the list of shows by.
 * @returns {Array<MediaResult>}
 */
export async function list(title) {
  await loadQualityProfiles();

  const resp = await sonarr().get('series');
  const shows = resp.map(mapToMediaResult);

  if (title) {
    return shows.filter((show) => {
      return show.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
    });
  }

  return shows;
}

/**
 * Searches for a new show not in the library.
 *
 * @param {String} query -- Search query to use when looking for the show.
 * @returns {Array<MediaResult>}
 */
export async function search(query) {
  await loadQualityProfiles();
  const resp = await sonarr().get('series/lookup', {term: query});

  return resp.map(mapToMediaResult);
}

/**
 * Adds a show to the library.
 *
 * @param {MediaResult} show -- Show to add to the library.
 * @returns {Object} -- sonarr response object
 */
export async function add(show) {
  const [quality] = _qualityProfiles;
  const [rootFolderResp] = await sonarr().get('rootfolder');

  return await sonarr().post('series', {
    tvdbId: show.tvdbId,
    title: show.title,
    titleSlug: show.slug,
    images: show.images,
    qualityProfileId: quality.id || 1,
    rootFolderPath: rootFolderResp.path
  });
}

async function loadQualityProfiles() {
  if (!_qualityProfiles) {
    _qualityProfiles = await sonarr().get('profile');
  }
}

function mapToMediaResult(show) {
  const quality = _qualityProfiles.find((profile) => profile.id === show.qualityProfileId);

  return {
    title: show.title,
    slug: show.titleSlug,
    year: show.year,
    tvdbId: show.tvdbId,
    imdbId: show.imdbId,
    images: show.images,
    status: show.status,
    quality: quality ? quality.name : ''
  };
}
