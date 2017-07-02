import assert from 'assert';
import config from 'config';
import merge from 'deepmerge';
import sinon from 'sinon';

import * as serverConfig from '~/api/config.js';
import * as radarr from '~/api/radarr.js';

/* eslint-disable max-len */
const sampleMoviesResponse = [
  {
    title: '10 Cloverfield Lane',
    sortTitle: '10 cloverfield lane',
    sizeOnDisk: 7847269480,
    status: 'released',
    overview: 'After a car accident, Michelle awakens to find herself in a mysterious bunker with two men named Howard and Emmett. Howard offers her a pair of crutches to help her remain mobile with her leg injury sustained from the car crash and tells her to "get good on those" before leaving the bunker. She has been given the information that there has been an alien attack and the outside world is poisoned. However, Howard and Emmett\'s intentions soon become questionable and Michelle is faced with a question: Is it better in here or out there?',
    inCinemas: '2016-03-10T05:00:00Z',
    physicalRelease: '2016-07-25T00:00:00Z',
    images: [
      {
        coverType: 'poster',
        url: '/movies/MediaCover/1/poster.jpg?lastWrite=636322052260000000'
      },
      {
        coverType: 'banner',
        url: '/movies/MediaCover/1/banner.jpg?lastWrite=636322052300000000'
      }
    ],
    website: 'http://www.10cloverfieldlane.com/',
    downloaded: true,
    year: 2016,
    hasFile: true,
    youTubeTrailerId: 'saHzng8fxLs',
    studio: 'Paramount Pictures',
    path: '/Library/Movies/10 Cloverfield Lane (2016)',
    profileId: 1,
    pathState: 'static',
    monitored: false,
    minimumAvailability: 'tba',
    isAvailable: true,
    folderName: '10 Cloverfield Lane (2016)',
    runtime: 103,
    lastInfoSync: '2017-07-02T00:47:58.498155Z',
    cleanTitle: '10cloverfieldlane',
    imdbId: 'tt1179933',
    tmdbId: 333371,
    titleSlug: '10-cloverfield-lane-333371',
    genres: [
      'Science Fiction'
    ],
    tags: [],
    added: '2017-05-22T19:06:40.690805Z',
    ratings: {
      votes: 2149,
      value: 6.8
    },
    alternativeTitles: [
      '10 Cloverfield Lane',
      'The Cellar',
      'Untitled Bad Robot Project',
      'Ten Cloverfield Lane',
      'Valencia'
    ],
    movieFile: {
      movieId: 0,
      relativePath: '10 Cloverfield Lane (2016) - HD 1080p.m4v',
      size: 7847269480,
      dateAdded: '2017-05-22T19:06:54.288692Z',
      quality: {
        quality: {
          id: 9,
          name: 'HDTV-1080p'
        },
        revision: {
          version: 1,
          real: 0
        }
      },
      mediaInfo: {
        videoCodec: 'AVC',
        videoBitrate: 9290408,
        videoBitDepth: 8,
        width: 1920,
        height: 800,
        audioFormat: 'AAC',
        audioBitrate: 164187,
        runTime: '01:43:34.7600000',
        audioStreamCount: 2,
        audioChannels: 2,
        audioChannelPositions: '2/0/0',
        audioChannelPositionsText: 'Front: L R',
        audioProfile: 'LC',
        videoFps: 23.976,
        audioLanguages: 'English / English',
        subtitles: 'Dutch',
        scanType: 'Progressive',
        schemaRevision: 3
      },
      id: 3
    },
    qualityProfileId: 1,
    id: 1
  },
  {
    title: 'Assassin\'s Creed',
    sortTitle: 'assassins creed',
    sizeOnDisk: 0,
    status: 'released',
    overview: 'Lynch discovers he is a descendant of the secret Assassins society through unlocked genetic memories that allow him to relive the adventures of his ancestor, Aguilar, in 15th Century Spain. After gaining incredible knowledge and skills he’s poised to take on the oppressive Knights Templar in the present day.',
    inCinemas: '2016-12-21T00:00:00Z',
    images: [
      {
        coverType: 'poster',
        url: '/radarr/MediaCover/1/poster.jpg?lastWrite=636200219330000000'
      },
      {
        coverType: 'banner',
        url: '/radarr/MediaCover/1/banner.jpg?lastWrite=636200219340000000'
      }
    ],
    website: 'https://www.ubisoft.com/en-US/',
    downloaded: false,
    year: 2016,
    hasFile: false,
    youTubeTrailerId: 'pgALJgMjXN4',
    studio: '20th Century Fox',
    path: '/Library/Movies/Assassin\'s Creed (2016)',
    profileId: 2,
    monitored: true,
    minimumAvailability: 'preDB',
    runtime: 115,
    lastInfoSync: '2017-01-23T22:05:32.365337Z',
    cleanTitle: 'assassinscreed',
    imdbId: 'tt2094766',
    tmdbId: 121856,
    titleSlug: 'assassins-creed-121856',
    genres: [
      'Action',
      'Adventure',
      'Fantasy',
      'Science Fiction'
    ],
    tags: [],
    added: '2017-01-14T20:18:52.938244Z',
    ratings: {
      votes: 711,
      value: 5.2
    },
    alternativeTitles: [
      'Assassin\'s Creed: The IMAX Experience'
    ],
    qualityProfileId: 2,
    id: 1
  },
  {
    title: 'First Blood',
    sortTitle: 'first blood',
    sizeOnDisk: 3242061910,
    status: 'released',
    overview: 'When former Green Beret John Rambo is harassed by local law enforcement and arrested for vagrancy, the Vietnam vet snaps, runs for the hills and rat-a-tat-tats his way into the action-movie hall of fame. Hounded by a relentless sheriff, Rambo employs heavy-handed guerilla tactics to shake the cops off his tail.',
    inCinemas: '1982-10-22T04:00:00Z',
    physicalRelease: '2002-06-11T00:00:00Z',
    images: [
      {
        coverType: 'poster',
        url: '/movies/MediaCover/237/poster.jpg?lastWrite=636310780120000000'
      },
      {
        coverType: 'banner',
        url: '/movies/MediaCover/237/banner.jpg?lastWrite=636310780180000000'
      }
    ],
    website: '',
    downloaded: true,
    year: 1982,
    hasFile: true,
    youTubeTrailerId: 'QzTmQwlUpV8',
    studio: 'Orion Pictures',
    path: '/Library/Movies/First Blood (1982)',
    profileId: 1,
    pathState: 'static',
    monitored: false,
    minimumAvailability: 'tba',
    isAvailable: true,
    folderName: 'First Blood (1982)',
    runtime: 93,
    lastInfoSync: '2017-07-02T00:49:36.179101Z',
    cleanTitle: 'firstblood',
    imdbId: 'tt0083944',
    tmdbId: 1368,
    titleSlug: 'first-blood-1368',
    genres: [
      'Action',
      'Adventure',
      'Thriller',
      'War'
    ],
    tags: [],
    added: '2017-05-22T19:26:22.525138Z',
    ratings: {
      votes: 1315,
      value: 7.2
    },
    alternativeTitles: [
      'First Blood',
      'Rambo 1 - First Blood',
      'Rambo',
      'Rambo I',
      'Rambo - First Blood Part I',
      'Rambo I - First Blood',
      'Rambo: First Blood'
    ],
    movieFile: {
      movieId: 0,
      relativePath: 'First Blood (1982) - HD 720p.mp4',
      size: 3242061910,
      dateAdded: '2017-05-22T19:32:50.919508Z',
      quality: {
        quality: {
          id: 4,
          name: 'HDTV-720p'
        },
        revision: {
          version: 1,
          real: 0
        }
      },
      mediaInfo: {
        videoCodec: 'AVC',
        videoBitrate: 4499501,
        videoBitDepth: 8,
        width: 1280,
        height: 544,
        audioFormat: 'AAC',
        audioBitrate: 127974,
        runTime: '01:33:08.7500000',
        audioStreamCount: 1,
        audioChannels: 2,
        audioChannelPositions: '2/0/0',
        audioChannelPositionsText: 'Front: L R',
        audioProfile: 'LC',
        videoFps: 23.976,
        audioLanguages: '',
        subtitles: '',
        scanType: 'Progressive',
        schemaRevision: 3
      },
      id: 233
    },
    qualityProfileId: 1,
    id: 237
  }
];
/* eslint-enable max-len */

describe('api.radarr', () => {
  let apiStub, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(serverConfig, 'default').returns({
      hostname: 'http://localhost',
      apiKey: 'abcdefghijklmnopqrstuvwxyz123456'
    });

    apiStub = sandbox.stub(radarr.default(), 'get');

    apiStub.withArgs('rootfolder').resolves([{path: ''}]);
    apiStub.withArgs('profile').resolves([
      {id: 1, name: 'Any'},
      {id: 2, name: 'HDTV-1080p'}
    ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.list()', () => {
    beforeEach(() => {
      apiStub.withArgs('movie').resolves(sampleMoviesResponse);
      apiStub.withArgs('movie', {search: 'First Blood'}).resolves([
        sampleMoviesResponse[2]
      ]);
    });

    it('should list all the movies', async () => {
      const movies = await radarr.list();
      assert.equal(movies.length, 3);
    });

    it('should list just movies with matching titles', async () => {
      const movies = await radarr.list('First Blood');
      assert.equal(movies.length, 1);
    });

    it('should format the movie response to use standardized keys', async () => {
      const movies = await radarr.list();
      assert.deepEqual(Object.keys(movies[0]),
          ['title', 'slug', 'year', 'tmdbId', 'imdbId', 'images', 'status', 'quality']);
    });

    it('should fill in the correct data in the correct fields', async () => {
      const [movie] = await radarr.list();

      assert.deepEqual(movie, {
        title: '10 Cloverfield Lane',
        slug: '10-cloverfield-lane-333371',
        year: 2016,
        tmdbId: 333371,
        imdbId: 'tt1179933',
        images: [
          {
            coverType: 'poster',
            url: '/movies/MediaCover/1/poster.jpg?lastWrite=636322052260000000'
          },
          {
            coverType: 'banner',
            url: '/movies/MediaCover/1/banner.jpg?lastWrite=636322052300000000'
          }
        ],
        status: 'released',
        quality: 'Any'
      });
    });
  });

  describe('.search()', () => {
    beforeEach(() => {
      apiStub.withArgs('movies/lookup', {term: 'assassin'}).resolves([
        sampleMoviesResponse[1]
      ]);
    });

    it('should return a formatted result', async () => {
      const [topResult] = await radarr.search('assassin');

      assert.deepEqual(topResult, {
        title: 'Assassin\'s Creed',
        slug: 'assassins-creed-121856',
        year: 2016,
        tmdbId: 121856,
        imdbId: 'tt2094766',
        images: [
          {
            coverType: 'poster',
            url: '/radarr/MediaCover/1/poster.jpg?lastWrite=636200219330000000'
          },
          {
            coverType: 'banner',
            url: '/radarr/MediaCover/1/banner.jpg?lastWrite=636200219340000000'
          }
        ],
        status: 'released',
        quality: 'HDTV-1080p'
      });
    });
  });

  describe('.add()', () => {
    let movie, addArg, postStub;

    beforeEach(() => {
      movie = {
        title: 'First Blood',
        slug: 'first-blood-1368',
        year: 1982,
        tmdbId: 1368,
        imdbId: 'tt0083944',
        images: [
          {
            coverType: 'poster',
            url: '/movies/MediaCover/237/poster.jpg?lastWrite=636310780120000000'
          },
          {
            coverType: 'banner',
            url: '/movies/MediaCover/237/banner.jpg?lastWrite=636310780180000000'
          }
        ],
        status: 'released',
        quality: 'Any'
      };

      addArg = {
        title: 'First Blood',
        titleSlug: 'first-blood-1368',
        tmdbId: 1368,
        images: [
          {
            coverType: 'poster',
            url: '/movies/MediaCover/237/poster.jpg?lastWrite=636310780120000000'
          },
          {
            coverType: 'banner',
            url: '/movies/MediaCover/237/banner.jpg?lastWrite=636310780180000000'
          }
        ],
        qualityProfileId: 1,
        rootFolderPath: '',
        addOptions: {
          searchForMovie: true
        }
      };

      postStub = sandbox.stub(radarr.default(), 'post');
    });

    it('should return a correct response', async () => {
      postStub.withArgs('movie', addArg).resolves(sampleMoviesResponse[2]);

      const resp = await radarr.add(movie);
      assert.deepEqual(resp, sampleMoviesResponse[2]);
    });

    it('should add using the quality from the config', async () => {
      sandbox.stub(config, 'has').withArgs('alexa-libby.movies.quality').returns(true);
      sandbox.stub(config, 'get').withArgs('alexa-libby.movies.quality').returns('HDTV-1080p');

      const argWithQuality = merge(addArg, {qualityProfileId: 2});

      await radarr.add(movie);
      assert.equal(postStub.calledWith('movie', argWithQuality), true);
    });
  });
});
