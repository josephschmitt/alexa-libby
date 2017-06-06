import assert from 'assert';
import sinon from 'sinon';

import * as sickbeard from '~/api/sickbeard.js';

const sandbox = sinon.sandbox.create();

const sampleShowsResponse = {
  data: {
    71489: {
      air_by_date: 0,
      cache: {
        banner: 1,
        poster: 1
      },
      language: 'en',
      network: 'USA Network',
      next_ep_airdate: '',
      paused: 0,
      quality: 'HD720p',
      show_name: 'Law & Order: Criminal Intent',
      status: 'Ended',
      tvdbid: 71489,
      tvrage_id: 4203,
      tvrage_name: 'Law & Order: Criminal Intent'
    },
    140141: {
      air_by_date: 0,
      cache: {
        banner: 0,
        poster: 0
      },
      language: 'fr',
      network: 'CBS',
      next_ep_airdate: '2012-01-15',
      paused: 0,
      quality: 'Any',
      show_name: 'Undercover Boss (US)',
      status: 'Continuing',
      tvdbid: 140141,
      tvrage_id: 22657,
      tvrage_name: 'Undercover Boss'
    },
    194751: {
      air_by_date: 1,
      cache: {
        banner: 1,
        poster: 1
      },
      language: 'en',
      network: 'TBS Superstation',
      next_ep_airdate: '2011-11-28',
      paused: 0,
      quality: 'Custom',
      show_name: 'Conan (2010)',
      status: 'Continuing',
      tvdbid: 194751,
      tvrage_id: 0,
      tvrage_name: ''
    },
    248261: {
      air_by_date: 0,
      cache: {
        banner: 1,
        poster: 1
      },
      language: 'en',
      network: 'Cartoon Network',
      next_ep_airdate: '',
      paused: 1,
      quality: 'HD',
      show_name: 'NTSF:SD:SUV::',
      status: 'Continuing',
      tvdbid: 248261,
      tvrage_id: 28439,
      tvrage_name: 'NTSF:SD:SUV'
    }
  },
  message: '',
  result: 'success'
};

describe('api.sickbeard', () => {
  let sbApiStub;

  before(() => {
    sbApiStub = sandbox.stub(sickbeard.default, 'cmd');
  });

  after(() => {
    sandbox.reset();
  });

  describe('.list()', () => {
    beforeEach(() => {
      sbApiStub.withArgs('shows').resolves(sampleShowsResponse);
    });

    it('should list all the shows', async () => {
      const shows = await sickbeard.list();
      assert.equal(shows.length, 4);
    });

    it('should format the show response to use standardized keys', async () => {
      const shows = await sickbeard.list();
      assert.deepEqual(Object.keys(shows[0]), ['title', 'year', 'tvdbid', 'status', 'quality']);
    });

    it('should fill in the correct data in the correct fields', async () => {
      const [show] = await sickbeard.list();

      assert.deepEqual(show, {
        title: 'Law & Order: Criminal Intent',
        year: undefined,
        tvdbid: 71489,
        status: 'ended',
        quality: 'HD720p'
      });
    });
  });
});
