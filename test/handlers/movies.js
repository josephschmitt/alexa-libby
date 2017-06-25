import Alexa from 'alexa-app';
import assert from 'assert';
import merge from 'deepmerge';
import sinon from 'sinon';

import * as getProvider from '~/api/getProvider.js';
import getResponseSSML from '~/lib/getResponseSSML.js';

import {
  handleFindMovieIntent
} from '~/handlers/movies.js';

import {
  ADD_PROMPT,
  ALREADY_WANTED,
  NO_MOVIE_FOUND,
  NO_MOVIE_SLOT
} from '~/responses/movies.js';

const sampleSession = {
  version: '1.0',
  session: {
    'new': false,
    sessionId: 'amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef',
    application: {
      applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
    },
    attributes: {},
    user: {
      userId: 'amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2'
    },
    userId: 'amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2',
    accessToken: null
  }
};

const sampleMovie = {
  title: 'My Movie',
  year: 2000,
  tvdbid: 12345,
  status: 'in library',
  quality: '1080p'
};

const sampleMovieResult = {
  title: 'My Search Movie',
  year: 2010,
  tvdbid: 123456,
  status: 'wanted',
  quality: '1080p'
};

describe('handlers.movies', () => {
  let apiStub, request, response, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    apiStub = sandbox.stub(getProvider, 'default').returns({
      list: sandbox.stub(),
      search: sandbox.stub()
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.handleFindMovieIntent()', () => {
    let findMovieRequest;

    beforeEach(() => {
      findMovieRequest = {
        request: {
          intent: {
            name: 'FindMovie',
            slots: {}
          }
        }
      };
    });

    it('should respond when there is no movie slot', (done) => {
      request = new Alexa.request(findMovieRequest);
      response = new Alexa.response(request.getSession());

      handleFindMovieIntent(request, response).then((movieResp) => {
        assert.equal(getResponseSSML(movieResp), NO_MOVIE_SLOT());
      }).then(done, done);
    });

    it('should respond when the movie is not found in your library', (done) => {
      apiStub().list.resolves([]);
      apiStub().search.resolves([]);

      findMovieRequest.request.intent.slots = {
        movieName: {
          name: 'movieName',
          value: 'test movie'
        }
      };

      request = new Alexa.request(findMovieRequest);
      response = new Alexa.response(request.getSession());

      handleFindMovieIntent(request, response).then((movieResp) => {
        assert.equal(getResponseSSML(movieResp),
            NO_MOVIE_FOUND(findMovieRequest.request.intent.slots.movieName.value));
      }).then(done, done);
    });

    it('should suggest searching for a movie when search result found', (done) => {
      apiStub().list.resolves([]);
      apiStub().search.resolves([sampleMovieResult]);

      findMovieRequest.request.intent.slots = {
        movieName: {
          name: 'movieName',
          value: 'test movie'
        }
      };

      request = new Alexa.request(merge(sampleSession, findMovieRequest));
      response = new Alexa.response(request.getSession());

      handleFindMovieIntent(request, response).then((movieResp) => {
        const response = NO_MOVIE_FOUND(findMovieRequest.request.intent.slots.movieName.value) +
            ' ' + ADD_PROMPT(sampleMovieResult.title, sampleMovieResult.year);

        assert.equal(getResponseSSML(movieResp), response);
        assert.equal(typeof movieResp.sessionObject.attributes.promptData, 'object');
      }).then(done, done);
    });

    it('should respond when the movie is already in the wanted list', (done) => {
      apiStub().list.resolves([sampleMovie]);

      findMovieRequest.request.intent.slots = {
        movieName: {
          name: 'movieName',
          value: 'test movie'
        }
      };

      request = new Alexa.request(findMovieRequest);
      response = new Alexa.response(request.getSession());

      handleFindMovieIntent(request, response).then((movieResp) => {
        assert.equal(getResponseSSML(movieResp),
            ALREADY_WANTED(sampleMovie.title, sampleMovie.year));
      }).then(done, done);
    });
  });
});
