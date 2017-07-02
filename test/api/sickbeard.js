import assert from 'assert';
import sinon from 'sinon';

import * as serverConfig from '~/api/config.js';
import * as sickbeard from '~/api/sickbeard.js';

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

const sampleSearchTvdbResponse = {
  data: {
    langid: 7,
    results: [
      {
        first_aired: '1992-05-25',
        name: 'The Tonight Show with Jay Leno',
        tvdbid: 70336
      },
      {
        first_aired: '2009-09-14',
        name: 'The Jay Leno Show',
        tvdbid: 113921
      }
    ]
  },
  message: '',
  result: 'success'
};

const sampleAddNew = {
  data: {
    name: 'Conan (2010)'
  },
  message: 'Conan (2010) has been queued to be added',
  result: 'success'
};

describe('api.sickbeard', () => {
  let sbApiStub, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sbApiStub = sandbox.stub(sickbeard.default(), 'cmd');

    sandbox.stub(serverConfig, 'default').returns({
      url: 'http://localhost',
      apikey: 'abcdefghijklmnopqrstuvwxyz123456'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.list()', () => {
    beforeEach(() => {
      sbApiStub.withArgs('shows').resolves(sampleShowsResponse);
    });

    it('should list all the shows', async () => {
      const shows = await sickbeard.list();
      assert.equal(shows.length, 4);
    });

    it('should list a specific show', async () => {
      const shows = await sickbeard.list('Undercover Boss');
      assert.equal(shows.length, 1);
    });

    it('should format the show response to use standardized keys', async () => {
      const shows = await sickbeard.list();
      assert.deepEqual(Object.keys(shows[0]), ['title', 'year', 'tvdbId', 'status', 'quality']);
    });

    it('should fill in the correct data in the correct fields', async () => {
      const [show] = await sickbeard.list();

      assert.deepEqual(show, {
        title: 'Law & Order: Criminal Intent',
        year: undefined,
        tvdbId: 71489,
        status: 'ended',
        quality: 'HD720p'
      });
    });
  });

  describe('.search()', () => {
    beforeEach(() => {
      sbApiStub.withArgs('sb.searchtvdb', {name: 'leno'}).resolves(sampleSearchTvdbResponse);
    });

    it('should return a formatted result', async () => {
      const shows = await sickbeard.search('leno');

      assert.deepEqual(shows, [{
        title: 'The Tonight Show with Jay Leno',
        tvdbId: 70336,
        year: '1992'
      }, {
        title: 'The Jay Leno Show',
        tvdbId: 113921,
        year: '2009'
      }]);
    });
  });

  describe('.add()', () => {
    let show;

    beforeEach(() => {
      show = {
        title: 'Conan (2010)',
        tvdbId: 194751,
        year: '2011'
      };

      sbApiStub.withArgs('show.addnew', {tvdbid: 194751, status: 'wanted'}).resolves(sampleAddNew);
    });

    it('should add a show and return the response', async () => {
      const resp = await sickbeard.add(show);
      assert.deepEqual(resp, sampleAddNew);
    });
  });
});
