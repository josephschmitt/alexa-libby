import assert from 'assert';
import config from 'config';
import sinon from 'sinon';

import getArtwork, {API} from '~/lib/getArtwork.js';

describe('lib.getArtwork', () => {
  let apiStubs, configStub, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    configStub = sandbox.stub(config, 'get').withArgs('alexa-libby.artwork.tmdbApiKey')
        .returns('1234');

    apiStubs = {
      call: sandbox.stub(),
      configure: sandbox.stub(),
      getImageUrl: sandbox.stub().callsFake((filename, size) => `${size}/${filename}`)
    };

    sandbox.stub(API, 'Client').callsFake((apiKey) => {
      if (apiKey) {
        return apiStubs;
      }
      else {
        throw new Error();
      }
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should throw an error if it cannot get a valid media id', async () => {
    try {
      await getArtwork({});
    }
    catch (e) {
      assert.equal(e.message,
          'You must provide a valid tmdbId, tvdbId, or imdbId to fetch artwork');
    }
  });

  it('should return null if there is no configured TMDB api key', async () => {
    configStub.returns(null);

    assert.equal(await getArtwork({tmdbId: 1234}), null);
  });

  it('should return null if no media is found', async () => {
    apiStubs.call.withArgs('/movie/1234').returns(undefined);

    assert.equal(await getArtwork({tmdbId: 1234}), null);
  });

  it('should call the TMDB API when it has a tmdbId', async () => {
    apiStubs.call.withArgs('/movie/1234').resolves({
      poster_path: 'myPoster.jpg'
    });

    assert.deepEqual(await getArtwork({tmdbId: 1234}), {
      smallImageUrl: 'w780/myPoster.jpg',
      largeImageUrl: 'w1280/myPoster.jpg'
    });
  });

  it('should call the TMDB find API when it has a tvdbId', async () => {
    apiStubs.call.withArgs('/find/1234', {external_source: 'tvdb_id'}).resolves({
      movie_results: [],
      tv_results: [{
        poster_path: 'myPoster.jpg'
      }]
    });

    assert.deepEqual(await getArtwork({tvdbId: 1234}), {
      smallImageUrl: 'w780/myPoster.jpg',
      largeImageUrl: 'w1280/myPoster.jpg'
    });
  });

  it('should call the TMDB find API when it has an imdbId movie', async () => {
    apiStubs.call.withArgs('/find/1234', {external_source: 'imdb_id'}).resolves({
      movie_results: [{
        poster_path: 'myPoster.jpg'
      }],
      tv_results: []
    });

    assert.deepEqual(await getArtwork({imdbId: 1234}), {
      smallImageUrl: 'w780/myPoster.jpg',
      largeImageUrl: 'w1280/myPoster.jpg'
    });
  });

  it('should call the TMDB find API when it has an imdbId TV show', async () => {
    apiStubs.call.withArgs('/find/1234', {external_source: 'imdb_id'}).resolves({
      movie_results: [],
      tv_results: [{
        poster_path: 'myPoster.jpg'
      }]
    });

    assert.deepEqual(await getArtwork({imdbId: 1234}), {
      smallImageUrl: 'w780/myPoster.jpg',
      largeImageUrl: 'w1280/myPoster.jpg'
    });
  });
});
