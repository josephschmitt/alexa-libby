import Alexa from 'alexa-app';
import SSML from 'alexa-app/lib/to-ssml.js';
import assert from 'assert';
import config from 'config';
import sinon from 'sinon';

import {PROVIDER_TYPE} from '~/api/getProvider.js';

import {
  handleLaunchIntent,
  handleYesIntent,
  handleNoIntent,
  handleCancelIntent,
  handleHelpIntent
} from '~/handlers/general.js';

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

describe('handlers.general', () => {
  const sandbox = sinon.sandbox.create();
  let request, response;

  beforeEach(() => {
    request = new Alexa.request({});
    response = new Alexa.response(request.getSession());
    response.send = () => {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.handleLaunchIntent()', () => {
    it('should respond with a welcome and help message', () => {
      handleLaunchIntent(request, response);

      const expectedResponse = `This skill allows you to manage your Couch Potato movie
list. You can ask Couch Potato about the movies in your queue or add
new movies to it. Try asking "Is The Godfather on the list?". If it's not and you want to add
it, try saying "Add The Godfather"`;
      assert.equal(getResponseSSML(response), expectedResponse);
    });
  });

  describe('.handleYesIntent()', () => {
    it('should throw an error when there\'s no session', () => {
      assert.throws(() => handleYesIntent(request, response), 'NO_SESSION');
    });

    it('should throw an error when there\'s no promptData in the session', () => {
      request = new Alexa.request(sampleSession);

      assert.throws(() => handleYesIntent(request, response), Error);
    });

    it('should throw an error when there\'s an unknown yesAction', () => {
      const yesSession = Object.assign({session: {promptData: {yesAction: 'randomAction'}}},
          sampleSession);

      request = new Alexa.request(yesSession);

      assert.throws(() => handleYesIntent(request, response), Error);
    });

    it('should throw an error when there\'s no providerType', () => {
      const yesSession = Object.assign({session: {promptData: {yesAction: 'addMedia'}}},
          sampleSession);

      request = new Alexa.request(yesSession);

      assert.throws(() => handleYesIntent(request, response), Error);
    });
  });
});

function getResponseSSML(response) {
  return SSML.cleanse(response.response.response.outputSpeech.ssml);
}
