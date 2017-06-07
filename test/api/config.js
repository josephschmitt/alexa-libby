import assert from 'assert';

import config from '~/api/config.js';

describe('api.config', () => {
  it('should read the global server config', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
        port: 8080
      }
    };

    assert.deepEqual(config({baseConfig: sampleConfig}), sampleConfig.server);
  });

  it('should read a media type config', () => {
    const sampleConfig = {
      movies: {
        server: {
          hostname: 'http://localhost',
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({mediaType: 'movies', baseConfig: sampleConfig}),
      sampleConfig.movies.server
    );
  });

  it('should merge a media type config with the global config', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
      },
      movies: {
        server: {
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({mediaType: 'movies', baseConfig: sampleConfig}),
      {hostname: 'http://localhost', port: 8080, apiKey: 'key'}
    );
  });

  it('should override a global config property with a media type config property', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
        port: 8080
      },
      movies: {
        server: {
          port: 9090,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({mediaType: 'movies', baseConfig: sampleConfig}),
      {hostname: 'http://localhost', port: 9090, apiKey: 'key'}
    );
  });

  it('should make special exceptions for sickbeard', () => {
    const sampleConfig = {
      shows: {
        provider: 'sickbeard',
        server: {
          hostname: 'http://localhost',
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({mediaType: 'shows', baseConfig: sampleConfig}),
      {url: 'http://localhost:8080', apikey: 'key'}
    );
  });
});
