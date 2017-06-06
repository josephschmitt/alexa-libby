import config from 'config';
import path from 'path';

const providers = {};

export default function getProvider(mediaType) {
  let provider = providers[mediaType];

  if (!provider) {
    const providerName = config.get(`alexa-libby.${mediaType}.provider`);
    provider = require(path.resolve(__dirname, providerName + '.js'));
    providers[mediaType] = provider;
  }

  return provider;
}
