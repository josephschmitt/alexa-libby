import config from 'config';
import path from 'path';

export const PROVIDER_TYPE = {
  MOVIES: 'movies',
  SHOWS: 'shows'
};

const providers = {};

/**
 * Get the correct API provider for a given provider type.
 *
 * @param {String} providerType -- PROVIDER_TYPE.MOVIES or PROVIDER_TYPE.SHOWS
 * @returns {Object}
 */
export default function getProvider(providerType) {
  let provider = providers[providerType];

  if (!provider) {
    const providerName = config.get(`alexa-libby.${providerType}.provider`);
    provider = require(path.resolve(__dirname, providerName + '.js'));
    providers[providerType] = provider;
  }

  return provider;
}
