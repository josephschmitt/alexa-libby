import config from 'config';
import url from 'url';

/**
 * Returns a config object for a given API provider.
 *
 * @param {String} mediaType -- "movies" or "shows"
 * @returns {Object}
 */
export default function (mediaType = 'movies') {
  const baseConfig = config.get('alexa-libby');
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
