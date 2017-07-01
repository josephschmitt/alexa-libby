import config from 'config';
import themoviedbclient from 'themoviedbclient';

/**
 * @typedef {Object} ArtworkOptions
 * @property {String} [tmdbId]
 * @property {String} [tvdbId]
 * @property {String} [imdbId]
 */

/**
 * @typedef {Object} ArtworkImages
 * @property {String} smallImageUrl
 * @property {String} largeImageUrl
 */

/* Dumb workaround to make this easier to stub and test */
export const API = {
  Client: themoviedbclient
};

/**
 * Fetches TMDB for artwork for a MediaResult and returns a large and small image url for use in a
 * skill card.
 *
 * @param {ArtworkOptions} options -- An object with a tmdb, tvdb, or imdb id on it. Usually a
 *     MediaResult from one of the API clients.
 * @returns {PromiseLike<ArtworkImages>}
 */
export default async function getArtwork({tmdbId, tvdbId, imdbId}) {
  if (!(tmdbId || tvdbId || imdbId)) {
    throw new Error('You must provide a valid tmdbId, tvdbId, or imdbId to fetch artwork');
  }

  try {
    const apiKey = config.get('alexa-libby.artwork.tmdbApiKey');
    const tmdb = new API.Client(apiKey);
    tmdb.configure({ssl: true});

    let media;
    if (tmdbId) {
      media = await tmdb.call(`/movie/${tmdbId}`);
    }
    else {
      const results = await tmdb.call(`/find/${tvdbId || imdbId}`, {
        external_source: tvdbId ? 'tvdb_id' : 'imdb_id'
      });
      media = results.tv_results.length ? results.tv_results[0] : results.movie_results[0];
    }

    if (!media) {
      return null;
    }

    return {
      smallImageUrl: tmdb.getImageUrl(media.poster_path, 'w780'),
      largeImageUrl: tmdb.getImageUrl(media.poster_path, 'w1280')
    };
  }
  catch (e) {
    return null;
  }
}
