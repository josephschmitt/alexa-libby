import config from 'config';
import path from 'path';

import api from '~/api/index.js';

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
  if (!providerType) {
    throw new Error('Missing a provider type');
  }

  let provider = providers[providerType];

  if (!provider) {
    const providerName = config.get(`alexa-libby.${providerType}.provider`).toLowerCase();

    try {
      provider = require(path.resolve(__dirname, providerName + '.js'));
      providers[providerType] = provider;
    }
    catch (e) {
      const apis = Object.keys(api).reduce((acc, val, i, arr) => {
        const isLast = i === arr.length - 1;
        return acc += `${isLast ? 'and ' : ''}"${val}"${!isLast ? ', ' : ''}`;
      }, '');

      throw new Error(`Invalid provider name: "${providerName}". ` +
          `Valid values are ${apis}, all lower case.`);
    }
  }

  return provider;
}
