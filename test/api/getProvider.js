import assert from 'assert';
import config from 'config';
import CouchPotato from 'couchpotato-api';
import SickBeard from 'node-sickbeard';
import sinon from 'sinon';

import getProvider from '~/api/getProvider.js';

const sandbox = sinon.sandbox.create();

describe('api.getProvider', () => {
  let getConfig;

  before(() => {
    getConfig = sandbox.stub(config, 'get');

    getConfig.withArgs('alexa-libby').returns({
      server: {
        hostname: 'http://localhost'
      },
      movies: {
        provider: 'couchpotato',
        server: {
          port: 9090,
          apiKey: 'abcdefghijklmnopqrstuvwxyz123456'
        }
      },
      shows: {
        provider: 'sickbeard',
        server: {
          port: 7070,
          apiKey: 'abcdefghijklmnopqrstuvwxyz123456'
        }
      }
    });
  });

  after(() => {
    sandbox.reset();
  });

  it('should get a Couch Potato API instance', () => {
    getConfig.withArgs('alexa-libby.movies.provider').returns('couchpotato');

    assert(getProvider('movies').default instanceof CouchPotato);
  });

  it('should get a Sickbeard API instance', () => {
    getConfig.withArgs('alexa-libby.shows.provider').returns('sickbeard');

    assert(getProvider('shows').default instanceof SickBeard);
  });
});
