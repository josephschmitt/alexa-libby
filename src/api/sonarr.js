import SonarrAPI from 'sonarr-api';
import serverConfig from '~/api/config.js';

/**
 * @typedef {Object} MediaResult
 * @property {String} title
 * @property {Number} [year]
 * @property {String} tvdbid
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
  return await sonarr().post('series', {tvdbid: show.tvdbId, title: show.title});
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
    year: show.year,
    tvdbid: show.tvdbId,
    status: show.status,
    quality: quality ? quality.name : ''
  };
}
