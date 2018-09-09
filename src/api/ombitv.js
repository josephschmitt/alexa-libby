import config from 'config';
import OmbiAPI from './OmbiApi.js';

import serverConfig from '~/api/config.js';
import {PROVIDER_TYPE} from '~/api/getProvider.js';

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

let _ombitv, _qualityProfiles;

export default function ombitv() {
  if (!_ombitv) {
    _ombitv = new OmbiAPI(serverConfig(PROVIDER_TYPE.SHOWS));
  }

  return _ombitv;
}

/**
 * Returns the list of shows currently being tracked by sonarr.
 *
 * @param {String} [title] -- Optional title to filter the list of shows by.
 * @returns {Array<MediaResult>}
 */
export async function list(title) {
  await loadQualityProfiles();

  const resp = await ombitv().get('Request/tvlite');
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
  const resp = await ombitv().get('Search/tv/'+ query);

  return resp.map(mapToMediaResult);
}

/**
 * Adds a show to the library.
 *
 * @param {MediaResult} show -- Show to add to the library.
 * @returns {Object} -- sonarr response object
 */
export async function add(show) {
  const result = await ombitv().post('Request/tv', {
    tvDbId: show.tvdbId,
    requestAll: true
  });

  if (result.result == true && result.isError == false){
    return result;
  } 
  else {
    throw new Error(result.errorMessage);
  }
}

async function loadQualityProfiles() {
  if (!_qualityProfiles) {
    _qualityProfiles = await ombitv().get('Sonarr/Profiles');
  }

  return _qualityProfiles;
}

function mapToMediaResult(show) {
  const preferredQuality = getPreferredQuality();
  const quality = _qualityProfiles.find((profile) => {
    return profile.id === show.qualityOverride || profile.name === preferredQuality;
  });

  const _images = [
    {
      "coverType": "poster",
      "url": show.posterPath
    },
    {
      "coverType": "background",
      "url": show.background
    }
  ];

  return {
    title: show.title,
    slug: show.overview,
    year: show.firstAired ? show.firstAired.split('-')[0] : show.releaseDate.split('-')[0],
    tvdbId: show.theTvDbId,
    imdbId: show.imdbId,
    images: _images,
    status: show.status,
    quality: quality ? quality.name : ''
  };
}

function getPreferredQuality() {
  const path = `alexa-libby.${PROVIDER_TYPE.SHOWS}.quality`;

  if (config.has(path)) {
    return config.get(path);
  }

  return null;
}
