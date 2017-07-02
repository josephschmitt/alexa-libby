import assert from 'assert';
import config from 'config';
import merge from 'deepmerge';
import sinon from 'sinon';

import * as serverConfig from '~/api/config.js';
import * as sonarr from '~/api/sonarr.js';

/* eslint-disable max-len */
const sampleShowsResponse = [
  {
    title: 'Game of Thrones',
    sortTitle: 'game thrones',
    seasonCount: 7,
    status: 'continuing',
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and the icy horrors beyond.',
    network: 'HBO',
    airTime: '21:00',
    images: [
      {
        coverType: 'fanart',
        url: 'http://thetvdb.com/banners/fanart/original/121361-94.jpg'
      },
      {
        coverType: 'banner',
        url: 'http://thetvdb.com/banners/graphical/121361-g19.jpg'
      },
      {
        coverType: 'poster',
        url: 'http://thetvdb.com/banners/posters/121361-59.jpg'
      }
    ],
    remotePoster: 'http://thetvdb.com/banners/posters/121361-59.jpg',
    seasons: [
      {
        seasonNumber: 0,
        monitored: false
      },
      {
        seasonNumber: 1,
        monitored: true
      },
      {
        seasonNumber: 2,
        monitored: true
      },
      {
        seasonNumber: 3,
        monitored: true
      },
      {
        seasonNumber: 4,
        monitored: true
      },
      {
        seasonNumber: 5,
        monitored: true
      },
      {
        seasonNumber: 6,
        monitored: true
      },
      {
        seasonNumber: 7,
        monitored: true
      }
    ],
    year: 2011,
    profileId: 1,
    seasonFolder: false,
    monitored: true,
    useSceneNumbering: false,
    runtime: 55,
    tvdbId: 121361,
    tvRageId: 24493,
    tvMazeId: 82,
    firstAired: '2011-04-17T04:00:00Z',
    seriesType: 'standard',
    cleanTitle: 'gamethrones',
    imdbId: 'tt0944947',
    titleSlug: 'game-of-thrones',
    certification: 'TV-MA',
    genres: [
      'Adventure',
      'Drama',
      'Fantasy'
    ],
    tags: [],
    added: '0001-01-01T00:00:00Z',
    ratings: {
      votes: 1695,
      value: 9.5
    },
    qualityProfileId: 1
  },
  {
    title: 'Marvel\'s Jessica Jones',
    sortTitle: 'marvels jessica jones',
    seasonCount: 1,
    status: 'continuing',
    overview: 'A former superhero decides to reboot her life by becoming a private investigator.',
    network: 'Netflix',
    airTime: '00:01',
    images: [
      {
        coverType: 'fanart',
        url: 'http://thetvdb.com/banners/fanart/original/284190-17.jpg'
      },
      {
        coverType: 'banner',
        url: 'http://thetvdb.com/banners/graphical/284190-g6.jpg'
      },
      {
        coverType: 'poster',
        url: 'http://thetvdb.com/banners/posters/284190-9.jpg'
      }
    ],
    remotePoster: 'http://thetvdb.com/banners/posters/284190-9.jpg',
    seasons: [
      {
        seasonNumber: 1,
        monitored: true
      }
    ],
    year: 2015,
    profileId: 1,
    seasonFolder: false,
    monitored: true,
    useSceneNumbering: false,
    runtime: 55,
    tvdbId: 284190,
    tvRageId: 0,
    tvMazeId: 1370,
    firstAired: '2015-11-20T05:00:00Z',
    seriesType: 'standard',
    cleanTitle: 'marvelsjessicajones',
    imdbId: 'tt2357547',
    titleSlug: 'marvels-jessica-jones',
    certification: 'TV-MA',
    genres: [
      'Action',
      'Crime',
      'Drama',
      'Suspense'
    ],
    tags: [],
    added: '0001-01-01T00:00:00Z',
    ratings: {
      votes: 71,
      value: 8.3
    },
    qualityProfileId: 1
  },
  {
    title: 'Silicon Valley',
    sortTitle: 'silicon valley',
    seasonCount: 4,
    status: 'continuing',
    overview: 'In the high-tech gold rush of modern Silicon Valley, the people most qualified to succeed are the least capable of handling success. A comedy partially inspired by Mike Judge\'s own experiences as a Silicon Valley engineer in the late 1980s.',
    network: 'HBO',
    airTime: '22:00',
    images: [
      {
        coverType: 'fanart',
        url: 'http://thetvdb.com/banners/fanart/original/277165-5.jpg'
      },
      {
        coverType: 'banner',
        url: 'http://thetvdb.com/banners/graphical/277165-g9.jpg'
      },
      {
        coverType: 'poster',
        url: 'http://thetvdb.com/banners/posters/277165-8.jpg'
      }
    ],
    remotePoster: 'http://thetvdb.com/banners/posters/277165-8.jpg',
    seasons: [
      {
        seasonNumber: 0,
        monitored: false
      },
      {
        seasonNumber: 1,
        monitored: true
      },
      {
        seasonNumber: 2,
        monitored: true
      },
      {
        seasonNumber: 3,
        monitored: true
      },
      {
        seasonNumber: 4,
        monitored: true
      }
    ],
    year: 2014,
    profileId: 2,
    seasonFolder: false,
    monitored: true,
    useSceneNumbering: false,
    runtime: 30,
    tvdbId: 277165,
    tvRageId: 33759,
    tvMazeId: 143,
    firstAired: '2014-04-06T04:00:00Z',
    seriesType: 'standard',
    cleanTitle: 'siliconvalley',
    imdbId: 'tt2575988',
    titleSlug: 'silicon-valley',
    certification: 'TV-MA',
    genres: [
      'Comedy'
    ],
    tags: [],
    added: '0001-01-01T00:00:00Z',
    ratings: {
      votes: 85,
      value: 8.8
    },
    qualityProfileId: 2
  }
];
/* eslint-enable max-len */

describe('api.sonarr', () => {
  let apiStub, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    apiStub = sandbox.stub(sonarr.default(), 'get');

    apiStub.withArgs('rootfolder').resolves([{path: ''}]);
    apiStub.withArgs('profile').resolves([
      {id: 1, name: 'Any'},
      {id: 2, name: 'HDTV-1080p'}
    ]);

    sandbox.stub(serverConfig, 'default').returns({
      hostname: 'http://localhost',
      apiKey: 'abcdefghijklmnopqrstuvwxyz123456'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.list()', () => {
    beforeEach(() => {
      apiStub.withArgs('series').resolves(sampleShowsResponse);
      apiStub.withArgs('series', {search: 'Silicon Valley'}).resolves([
        sampleShowsResponse[2]
      ]);
    });

    it('should list all the shows', async () => {
      const shows = await sonarr.list();
      assert.equal(shows.length, 3);
    });

    it('should list just shows with matching titles', async () => {
      const shows = await sonarr.list('Jessica Jones');
      assert.equal(shows.length, 1);
    });

    it('should format the show response to use standardized keys', async () => {
      const shows = await sonarr.list();
      assert.deepEqual(Object.keys(shows[0]),
          ['title', 'slug', 'year', 'tvdbId', 'imdbId', 'images', 'status', 'quality']);
    });

    it('should fill in the correct data in the correct fields', async () => {
      const [show] = await sonarr.list();

      assert.deepEqual(show, {
        title: 'Game of Thrones',
        slug: 'game-of-thrones',
        year: 2011,
        tvdbId: 121361,
        imdbId: 'tt0944947',
        images: [
          {
            coverType: 'fanart',
            url: 'http://thetvdb.com/banners/fanart/original/121361-94.jpg'
          },
          {
            coverType: 'banner',
            url: 'http://thetvdb.com/banners/graphical/121361-g19.jpg'
          },
          {
            coverType: 'poster',
            url: 'http://thetvdb.com/banners/posters/121361-59.jpg'
          }
        ],
        status: 'continuing',
        quality: 'Any'
      });
    });
  });

  describe('.search()', () => {
    beforeEach(() => {
      apiStub.withArgs('series/lookup', {term: 'jessica'}).resolves([
        sampleShowsResponse[1]
      ]);
    });

    it('should return a formatted result', async () => {
      const [topResult] = await sonarr.search('jessica');

      assert.deepEqual(topResult, {
        title: 'Marvel\'s Jessica Jones',
        slug: 'marvels-jessica-jones',
        year: 2015,
        tvdbId: 284190,
        imdbId: 'tt2357547',
        images: [
          {
            coverType: 'fanart',
            url: 'http://thetvdb.com/banners/fanart/original/284190-17.jpg'
          },
          {
            coverType: 'banner',
            url: 'http://thetvdb.com/banners/graphical/284190-g6.jpg'
          },
          {
            coverType: 'poster',
            url: 'http://thetvdb.com/banners/posters/284190-9.jpg'
          }
        ],
        status: 'continuing',
        quality: 'Any'
      });
    });
  });

  describe('.add()', () => {
    let show, addArg, postStub;

    beforeEach(() => {
      show = {
        title: 'Silicon Valley',
        slug: 'silicon-valley',
        year: 2014,
        tvdbId: 277165,
        imdbId: 'tt2575988',
        images: [
          {
            coverType: 'fanart',
            url: 'http://thetvdb.com/banners/fanart/original/277165-5.jpg'
          },
          {
            coverType: 'banner',
            url: 'http://thetvdb.com/banners/graphical/277165-g9.jpg'
          },
          {
            coverType: 'poster',
            url: 'http://thetvdb.com/banners/posters/277165-8.jpg'
          }
        ],
        status: 'continuing',
        quality: 'HDTV-1080p'
      };

      addArg = {
        title: 'Silicon Valley',
        titleSlug: 'silicon-valley',
        tvdbId: 277165,
        images: [
          {
            coverType: 'fanart',
            url: 'http://thetvdb.com/banners/fanart/original/277165-5.jpg'
          },
          {
            coverType: 'banner',
            url: 'http://thetvdb.com/banners/graphical/277165-g9.jpg'
          },
          {
            coverType: 'poster',
            url: 'http://thetvdb.com/banners/posters/277165-8.jpg'
          }
        ],
        qualityProfileId: 1,
        rootFolderPath: ''
      };

      postStub = sandbox.stub(sonarr.default(), 'post');
    });

    it('should return a correct response', async () => {
      postStub.withArgs('series', addArg).resolves(sampleShowsResponse[2]);

      const resp = await sonarr.add(show);
      assert.deepEqual(resp, sampleShowsResponse[2]);
    });

    it('should add using the quality from the config', async () => {
      sandbox.stub(config, 'get').withArgs('alexa-libby.shows.quality').returns('HDTV-1080p');
      const argWithQuality = merge(addArg, {qualityProfileId: 2});

      await sonarr.add(show);
      assert.equal(postStub.calledWith('series', argWithQuality), true);
    });
  });
});
