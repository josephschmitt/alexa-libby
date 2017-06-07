import SickBeardAPI from 'node-sickbeard';
import serverConfig from '~/api/config.js';

/**
 * @typedef {Object} MediaResult
 * @property {String} title
 * @property {Number} [year]
 * @property {String} tvdbid
 * @property {String} [status]
 * @property {String} [quality]
 */

const sickbeard = new SickBeardAPI(serverConfig('shows'));
export default sickbeard;

/**
 * Returns the list of shows currently being tracked by Sickbeard.
 *
 * @param {String} [title] -- Optional title to filter the list of shows by.
 * @returns {Array<MediaResult>}
 */
export async function list(title) {
  const resp = await sickbeard.cmd('shows', {sort: 'name'});

  const results = Object.keys(resp.data).map((key) => {
    const show = resp.data[key];

    return {
      title: show.show_name,
      year: show.year,
      tvdbid: show.tvdbid,
      status: show.status.toLowerCase(),
      quality: show.quality
    };
  });

  if (title) {
    return results.filter((result) => {
      return result.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
    });
  }

  return results;
}

/**
 * Searches for a new show not in the library.
 *
 * @param {String} query -- Search query to use when looking for the show.
 * @returns {Array<MediaResult>}
 */
export async function search(query) {
  const resp = await sickbeard.cmd('sb.searchtvdb', {name: query});
  const results = Array.isArray(resp.data.results) ? resp.data.results : [];

  return Array.isArray(results) ? results.map((show) => {
    return {
      title: show.name,
      year: new Date(show.first_aired).getFullYear(),
      tvdbid: show.tvdbid
    };
  }) : [];
}

/**
 * Adds a show to the library.
 *
 * @param {MediaResult} show -- Show to add to the library.
 * @returns {Object} -- Sickbeard response object
 */
export async function add(show) {
  return await sickbeard.cmd('show.addnew', {tvdbid: show.tvdbid, status: 'wanted'});
}
