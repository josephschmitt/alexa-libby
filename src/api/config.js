import config from 'config';
import url from 'url';

const libbyConfig = config.get('alexa-libby');

/**
 * Returns a config object for a given API provider.
 *
 * @param {Object} options
 * @property {String} mediaType -- "movies" or "shows"
 * @property {String} baseConfig -- Config object to use. Defaults to loading one from config/ dir
 * @returns {Object}
 */
export default function ({mediaType = 'movies', baseConfig = libbyConfig}) {
  const serverConfig = baseConfig.server || {};
  const mediaConfig = baseConfig[mediaType] || {};
  const conf = Object.assign({}, serverConfig, mediaConfig.server || {});

  // The node-sickbeard API module has slightly different config params
  if (mediaConfig && mediaConfig.provider === 'sickbeard') {
    if (conf.hasOwnProperty('hostname')) {
      const parsed = url.parse(conf.hostname);
      conf.url = url.format({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: conf.port
      });

      delete conf.hostname;
      delete conf.port;
    }

    if (conf.hasOwnProperty('apiKey')) {
      conf.apikey = conf.apiKey;
      delete conf.apiKey;
    }
  }

  return conf;
}
