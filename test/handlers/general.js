import Alexa from 'alexa-app';
import assert from 'assert';
import merge from 'deepmerge';
import sinon from 'sinon';

import * as provider from '~/api/getProvider.js';
import getResponseSSML from '~/lib/getResponseSSML.js';

import {
  handleLaunchIntent,
  handleYesIntent,
  handleNoIntent,
  handleCancelIntent,
  handleHelpIntent
} from '~/handlers/general.js';

import {
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  WELCOME_DESCRIPTION
} from '~/responses/general.js';

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

const yesPromptSession = merge(sampleSession, {
  session: {
    attributes: {
      promptData: {
        yesAction: 'addMedia',
        yesResponse: 'Yes response.',
        providerType: provider.PROVIDER_TYPE.MOVIES,
        searchResults: []
      }
    }
  }
});

describe('handlers.general', () => {
  let request, response, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.handleLaunchIntent()', () => {
    beforeEach(() => {
      request = new Alexa.request({});
      response = new Alexa.response(request.getSession());
    });

    it('should respond with a welcome and help message', () => {
      handleLaunchIntent(request, response);
      assert.equal(getResponseSSML(response), `${WELCOME_DESCRIPTION()} ${HELP_RESPONSE()}`);
    });
  });

  describe('.handleCancelIntent()', () => {
    beforeEach(() => {
      request = new Alexa.request({});
      response = new Alexa.response(request.getSession());
    });

    it('should respond with a cancel message', () => {
      handleCancelIntent(request, response);
      assert.equal(getResponseSSML(response), CANCEL_RESPONSE());
    });
  });

  describe('.handleHelpIntent()', () => {
    beforeEach(() => {
      request = new Alexa.request({});
      response = new Alexa.response(request.getSession());
    });

    it('should respond with a help message', () => {
      handleHelpIntent(request, response);
      assert.equal(getResponseSSML(response), HELP_RESPONSE());
    });
  });

  describe('.handleYesIntent()', () => {
    it('should throw an error when there\'s no session', () => {
      request = new Alexa.request({});
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleYesIntent(request, response), 'NO_SESSION');
    });

    it('should throw an error when there\'s no promptData in the session', () => {
      request = new Alexa.request(sampleSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleYesIntent(request, response), Error);
    });

    it('should throw an error when there\'s an unknown yesAction', () => {
      const yesSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              yesAction: 'randomAction'
            }
          }
        }
      });

      request = new Alexa.request(yesSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleYesIntent(request, response), Error);
    });

    it('should throw an error when there\'s no providerType', () => {
      const yesSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              yesAction: 'addMedia'
            }
          }
        }
      });

      request = new Alexa.request(yesSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleYesIntent(request, response), Error);
    });

    it('should call the add API provider when confirming adding new media', () => {
      const apiAdd = sandbox.stub().resolves();
      sandbox.stub(provider, 'default').returns({add: apiAdd});

      request = new Alexa.request(yesPromptSession);
      response = new Alexa.response(request.getSession());

      handleYesIntent(request, response);

      assert(apiAdd.called);
    });

    it('should respond with a confirmation after adding new media', (done) => {
      sandbox.stub(provider, 'default').returns({add: sandbox.stub().resolves()});

      request = new Alexa.request(yesPromptSession);
      response = new Alexa.response(request.getSession());

      handleYesIntent(request, response).then(() => {
        assert.equal(getResponseSSML(response),
            yesPromptSession.session.attributes.promptData.yesResponse);
      }).then(done, done);
    });
  });

  describe('.handleNoIntent()', () => {
    it('should throw an error when there\'s no session', () => {
      request = new Alexa.request({});
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleNoIntent(request, response), 'NO_SESSION');
    });

    it('should throw an error when there\'s no promptData in the session', () => {
      request = new Alexa.request(sampleSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleNoIntent(request, response), Error);
    });

    it('should throw an error when there\'s an unknown noAction', () => {
      const noSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              noAction: 'randomAction'
            }
          }
        }
      });

      request = new Alexa.request(noSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleNoIntent(request, response), Error);
    });

    it('should throw an error when there\'s no providerType', () => {
      const noSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              noAction: 'suggestNext'
            }
          }
        }
      });

      request = new Alexa.request(noSession);
      response = new Alexa.response(request.getSession());

      assert.throws(() => handleNoIntent(request, response), Error);
    });

    it('should end the session when asked to', (done) => {
      const noSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              noAction: 'endSession',
              noResponse: 'No response'
            }
          }
        }
      });

      request = new Alexa.request(noSession);
      response = new Alexa.response(request.getSession());

      handleNoIntent(request, response).then(() => {
        assert.equal(response.response.response.shouldEndSession, true);
        assert.equal(getResponseSSML(response), noSession.session.attributes.promptData.noResponse);
      }).then(done, done);
    });

    it('should suggest the next result if there are more', (done) => {
      const noSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              noAction: 'suggestNext',
              noResponse: 'Ok, did you mean result 2?',
              searchResults: [{title: 'result 1'}, {title: 'result 2'}],
            }
          }
        }
      });

      request = new Alexa.request(noSession);
      response = new Alexa.response(request.getSession());

      handleNoIntent(request, response).then((noResponse) => {
        assert.equal(response.response.response.shouldEndSession, false);
        assert.equal(getResponseSSML(noResponse),
            noSession.session.attributes.promptData.noResponse);
      }).then(done, done);
    });

    it('should end the session when there are no more results to suggest', (done) => {
      const noSession = merge(sampleSession, {
        session: {
          attributes: {
            promptData: {
              noAction: 'suggestNext',
              noResponse: 'Ok. I\'m out of suggestions. Sorry about that.',
              searchResults: [{title: 'result 1'}],
            }
          }
        }
      });

      request = new Alexa.request(noSession);
      response = new Alexa.response(request.getSession());

      handleNoIntent(request, response).then((noResponse) => {
        assert.equal(response.response.response.shouldEndSession, true);
        assert.equal(getResponseSSML(noResponse),
            noSession.session.attributes.promptData.noResponse);
      }).then(done, done);
    });
  });
});
