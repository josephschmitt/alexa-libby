import assert from 'assert';
import config from 'config';
import sinon from 'sinon';

import serverConfig from '~/api/config.js';

describe('api.config', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should read the global server config', () => {
    const sampleConfig = {
      server: {
        hostname: 'http://localhost',
        port: 8080
      }
    };

    sandbox.stub(config, 'get').returns(sampleConfig);
    assert.deepEqual(serverConfig(), sampleConfig.server);
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

    sandbox.stub(config, 'get').returns(sampleConfig);
    assert.deepEqual(serverConfig('movies'), sampleConfig.movies.server);
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

    sandbox.stub(config, 'get').returns(sampleConfig);

    assert.deepEqual(
      serverConfig('movies'),
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

    sandbox.stub(config, 'get').returns(sampleConfig);

    assert.deepEqual(
      serverConfig('movies'),
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

    sandbox.stub(config, 'get').returns(sampleConfig);

    assert.deepEqual(
      serverConfig('shows'),
      {url: 'http://localhost:8080', apikey: 'key'}
    );
  });
});
