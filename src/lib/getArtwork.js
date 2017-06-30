import TMDBClient from 'themoviedbclient';
import config from 'config';

import {PROVIDER_TYPE} from '~/api/getProvider.js';

export const ARTWORK_SERVICE = {
  TMDB: 'tmdb',
  TVDB: 'tvdb'
};

/**
 * @typedef ArtworkImages
 * @property {String} smallImageUrl
 * @property {String} largeImageUrl
 */

/**
 * Queries various artwork API services and returns a large and small image url for use in a skill
 * card.
 *
 * @param {String} serviceName -- ARTWORK_SERVICE.TMDB or ARTWORK_SERVICE.TVDB
 * @param {String|Number} mediaId -- Unique id for the service. E.g. tvdbId or tmdbId
 * @returns {PromiseLike<ArtworkImages>}
 */
export default async function getArtwork(serviceName, mediaId) {
  if (serviceName === ARTWORK_SERVICE.TMDB) {
    return await getTmdbArtwork(mediaId);
  }
  else if (serviceName === ARTWORK_SERVICE.TVDB) {
    return null;
  }

  throw new Error('Unsupported artwork service: ' + serviceName);
}

async function getTmdbArtwork(mediaId) {
  try {
    const apiKey = config.get(`alexa-libby.${PROVIDER_TYPE.MOVIES}.tmdb.apiKey`);
    const tmdb = new TMDBClient(apiKey);

    tmdb.configure({
      ssl: true
    });

    const movie = await tmdb.call(`/movie/${mediaId}`);
    if (!movie) {
      return null;
    }

    return {
      smallImageUrl: tmdb.getImageUrl(movie.poster_path, 'w780'),
      largeImageUrl: tmdb.getImageUrl(movie.poster_path, 'w1280')
    };
  }
  catch (e) {
    return null;
  }
}
