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

  it('should read a provider config', () => {
    const sampleConfig = {
      couchpotato: {
        server: {
          hostname: 'http://localhost',
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({provider: 'couchpotato', baseConfig: sampleConfig}),
      sampleConfig.couchpotato.server
    );
  });

  it('should merge a provider config with the global config', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
      },
      couchpotato: {
        server: {
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({provider: 'couchpotato', baseConfig: sampleConfig}),
      {hostname: 'http://localhost', port: 8080, apiKey: 'key'}
    );
  });

  it('should overrid a global config property with a provider config property', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
        port: 8080
      },
      couchpotato: {
        server: {
          port: 9090,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({provider: 'couchpotato', baseConfig: sampleConfig}),
      {hostname: 'http://localhost', port: 9090, apiKey: 'key'}
    );
  });

  it('should make special exceptions for sickbeard', () => {
    const sampleConfig = {
      sickbeard: {
        server: {
          hostname: 'http://localhost',
          port: 8080,
          apiKey: 'key'
        }
      }
    };

    assert.deepEqual(
      config({provider: 'sickbeard', baseConfig: sampleConfig}),
      {url: 'http://localhost:8080', apikey: 'key'}
    );
  });
});
