import assert from 'assert';
import sinon from 'sinon';

import * as serverConfig from '~/api/config.js';
import * as couchpotato from '~/api/couchpotato.js';

/* eslint-disable max-len */
const sampleMoviesResponse = {
  movies: [
    {
      status: 'done',
      info: {
        rating: {
          imdb: [
            7.2,
            194126
          ]
        },
        genres: [
          'Science Fiction',
          'Drama',
          'Horror',
          'Mystery',
          'Sci-Fi',
          'Thriller'
        ],
        tmdb_id: 333371,
        plot: 'After a car accident, Michelle awakens to find herself in a mysterious bunker with two men named Howard and Emmett. Howard offers her a pair of crutches to help her remain mobile with her leg injury sustained from the car crash and tells her to "get good on those" before leaving the bunker. She has been given the information that there has been an alien attack and the outside world is poisoned. However, Howard and Emmett\'s intentions soon become questionable and Michelle is faced with a question: Is it better in here or out there?',
        tagline: 'Monsters come in many forms.',
        original_title: '10 Cloverfield Lane',
        actor_roles: {
          'Mat Vairo': 'Jeremy',
          'Maya Erskine': 'Darcy',
          'Ryan Martin Dwyer': 'Extra Licoreria',
          'John Goodman': 'Howard Stambler',
          'Suzanne Cryer': 'Leslie',
          'John Gallagher Jr.': 'Emmett DeWitt',
          'Douglas M. Griffin': 'Driver',
          'Mary Elizabeth Winstead': 'Michelle',
          'Bradley Cooper': 'Ben (voice)',
          'Cindy Hogan': 'Neighbor Woman'
        },
        via_imdb: true,
        mpaa: 'PG-13',
        via_tmdb: true,
        titles: [
          '10 Cloverfield Lane',
          'The Cellar',
          'Untitled Bad Robot Project',
          'Ten Cloverfield Lane',
          'Valencia',
          'Вул. Монстро, 10',
          'Монстро 2',
          '科洛弗10號地窖',
          'Вулиця Кловерфілд, 10',
          'Ул. Чудовищно 10'
        ],
        imdb: 'tt1179933',
        year: 2016,
        images: {
          disc_art: [],
          poster: [
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjEzMjczOTIxMV5BMl5BanBnXkFtZTgwOTUwMjI3NzE@._V1_.jpg'
          ],
          extra_thumbs: [],
          poster_original: [
            'https://image.tmdb.org/t/p/original/aeiVxTSTeGJ2ICf1iSDXkF3ivZp.jpg'
          ],
          landscape: [],
          actors: {
            'Mat Vairo': 'https://image.tmdb.org/t/p/w185/jwoIHRvTNiqrgpFZk9NMp6Yxz1S.jpg',
            'Maya Erskine': 'https://image.tmdb.org/t/p/w185/ujJinfGkFnBKQ6mGijDa47fbJDW.jpg',
            'John Goodman': 'https://image.tmdb.org/t/p/w185/mLJC7sRO3JnGkySJlwCJblvhBHm.jpg',
            'Suzanne Cryer': 'https://image.tmdb.org/t/p/w185/AkMReAlA7VyazP89hmzNaZmT9WR.jpg',
            'John Gallagher Jr.': 'https://image.tmdb.org/t/p/w185/2mn6gmPdFKaGBBAEMtTEk1tCVyi.jpg',
            'Douglas M. Griffin': 'https://image.tmdb.org/t/p/w185/5QTBIsyxZRo21uYGtpGBxvkz6cB.jpg',
            'Mary Elizabeth Winstead': 'https://image.tmdb.org/t/p/w185/7GFT1a5naPqg9WrfP5eBHjqDQ0K.jpg',
            'Bradley Cooper': 'https://image.tmdb.org/t/p/w185/2daC5DeXqwkFND0xxutbnSVKN6c.jpg',
            'Cindy Hogan': 'https://image.tmdb.org/t/p/w185/psxEhYc97fL6suQjsKGEdkqODG3.jpg'
          },
          backdrop_original: [
            'https://image.tmdb.org/t/p/original/qEu2EJBQUNFx5mSKOCItwZm74ZE.jpg'
          ],
          clear_art: [],
          logo: [],
          banner: [],
          backdrop: [
            'https://image.tmdb.org/t/p/w1280/qEu2EJBQUNFx5mSKOCItwZm74ZE.jpg'
          ],
          extra_fanart: []
        },
        actors: [],
        runtime: 103,
        type: 'movie'
      },
      _t: 'media',
      releases: [
        {
          status: 'done',
          files: {
            movie: [
              '/Library/Movies/10 Cloverfield Lane (2016)/10 Cloverfield Lane (2016) - HD 1080p.m4v'
            ]
          },
          _id: '489197e008f84d63a6fa5c33de5e2d94',
          media_id: 'be947181df604bb58588711638751fec',
          _rev: '000e3edc',
          _t: 'release',
          is_3d: false,
          last_edit: 1496535934,
          identifier: 'tt1179933..1080p',
          quality: '1080p'
        }
      ],
      title: '10 Cloverfield Lane',
      _rev: '000e78e5',
      profile_id: null,
      _id: 'be947181df604bb58588711638751fec',
      category_id: null,
      type: 'movie',
      identifiers: {
        imdb: 'tt1179933'
      }
    },
    {
      status: 'done',
      info: {
        rating: {
          imdb: [
            7.2,
            238232
          ]
        },
        genres: [
          'Comedy',
          'Romance',
          'Drama'
        ],
        tmdb_id: 4951,
        plot: 'Bianca, a tenth grader, has never gone on a date, but she isn\'t allowed to go out with boys until her older sister Kat gets a boyfriend. The problem is, Kat rubs nearly everyone the wrong way. But Bianca and the guy she has her eye on, Joey, are eager, so Joey fixes Kat up with Patrick, a new kid in town just bitter enough for Kat.',
        tagline: 'How do I loathe thee? Let me count the ways.',
        original_title: '10 Things I Hate About You',
        actor_roles: {
          'Wendy Gottlieb': 'Heather',
          'Bianca Kajlich': 'Coffee Girl',
          'Monique Powell': 'Save Ferris Singer',
          'Travis Muller': 'Cowboy',
          'Jesse Dyer': 'Screaming Loser',
          'Brian Mashburn': 'Save Ferris Singer',
          'Alice Evans': 'Perky Girl',
          'Allison Janney': 'Ms. Perky',
          'Terence Heuston': 'Derek',
          'Heath Ledger': 'Patrick Verona',
          'Daryl Mitchell': 'Mr. Morgan',
          'Jelani Quinn': 'Crying Loser',
          'Julia Stiles': 'Katarina "Kat" Stratford',
          'Larry Miller': 'Walter Stratford',
          'Eric Riedmann': 'Audio Visual Guy',
          'Jesper Inglis': 'Buckaroo Bartender',
          'Laura Kenny': 'Judith',
          'Ari Karczag': 'Kissing Guy',
          'Joseph Gordon-Levitt': 'Cameron James',
          'Brian Hood': 'Clem',
          'Aaron Therol': 'Detention Student',
          'Susan May Pratt': 'Mandella',
          'Joshua Thorpe': 'Jock',
          'Ben Laurance': 'Wimpy Loser',
          'J.R. Johnson': 'Mba Guy at Party',
          'Heather Taylor': 'Drunken Girl',
          'Nick Vukelic': 'Drugged Out Loser',
          'Nick Brown': 'Biker',
          'Michael Eisenstein': 'Letters To Cleo Singer',
          'Kay Hanley': 'Letters To Cleo Singer',
          'David Leisure': 'Mr. Chapin',
          'Aidan Kennedy': 'Laughing Loser',
          'Larisa Oleynik': 'Bianca Stratford',
          'David Krumholtz': 'Michael Eckman',
          'Quinn Maixner': 'Beautiful Jock',
          'Todd Butler': 'Coffee Kid',
          'Greg Jackson': 'Scruvy',
          'Cameron Fraser': 'Trevor',
          'Carlos Lacámara': 'Bartender',
          'Andrew Keegan': 'Joey Donner',
          'Demegio Kimbrough': 'Coffee Kid',
          'Dennis Mosley': 'Cohort',
          'Gabrielle Union': 'Chastity',
          'Kyle Cease': 'Bogie Lowenstien'
        },
        via_imdb: true,
        mpaa: 'PG-13',
        via_tmdb: true,
        titles: [
          '10 Things I Hate About You',
          '10 Razones Para Odiarte',
          '10 cosas que odio de ti',
          '10 Coisas Que Odeio em Ti',
          '10 důvodů, proč tě nenávidím',
          '10 vecí, ktoré na tebe nenávidím',
          '10 Cosas Que Odio de ti'
        ],
        imdb: 'tt0147800',
        year: 1999,
        images: {
          disc_art: [],
          poster: [
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMmVhZjhlZDYtMDAwZi00MDcyLTgzOTItOWNiZjY0YmE0MGE0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'
          ],
          extra_thumbs: [],
          poster_original: [
            'https://image.tmdb.org/t/p/original/paS5plbzKz3PYddxky6svYYz3hS.jpg'
          ],
          landscape: [],
          actors: {
            'David Leisure': 'https://image.tmdb.org/t/p/w185/rEyz16UwSZWoYahJw78Pg4BxLjv.jpg',
            'Larry Miller': 'https://image.tmdb.org/t/p/w185/34dS3zf1VKMFvgQY6K6ZHaXYFFN.jpg',
            'Bianca Kajlich': 'https://image.tmdb.org/t/p/w185/7eKTyl55sYtYen9Ky7DQGLMhOnC.jpg',
            'Larisa Oleynik': 'https://image.tmdb.org/t/p/w185/qhRcTWcXykI29zsuEC4po563sJC.jpg',
            'Daryl Mitchell': 'https://image.tmdb.org/t/p/w185/mSrPd1XH1akZtDXsBXN8m0wvluG.jpg',
            'David Krumholtz': 'https://image.tmdb.org/t/p/w185/5171elOp1qFxf9c8DkpeyhHBB6d.jpg',
            'Aidan Kennedy': 'https://image.tmdb.org/t/p/w185/dPMBlHWPzlJiBRf76VXoGluHYbN.jpg',
            'Laura Kenny': 'https://image.tmdb.org/t/p/w185/nSKGdbGXTM21odLcQNzZhsxRpfE.jpg',
            'Eric Riedmann': 'https://image.tmdb.org/t/p/w185/kJvnqsXN5zplpRauwaA69EvgXnM.jpg',
            'Allison Janney': 'https://image.tmdb.org/t/p/w185/fido6hwI8tFSZNt6HtP2DZH2eu6.jpg',
            'Joseph Gordon-Levitt': 'https://image.tmdb.org/t/p/w185/zSuXCR6xCKIgo0gWLdp8moMlH3I.jpg',
            'Andrew Keegan': 'https://image.tmdb.org/t/p/w185/3GNxQcRNySLlO25wcPuwnxuPv3f.jpg',
            'Susan May Pratt': 'https://image.tmdb.org/t/p/w185/iIHOYjPPhHgqcClshtYrJn93ngb.jpg',
            'Carlos Lacámara': 'https://image.tmdb.org/t/p/w185/mf5a9afrahmA2bOwgfaJVjDrzpJ.jpg',
            'Julia Stiles': 'https://image.tmdb.org/t/p/w185/s7OC22crrqBo8qjI5TGk4hRKd44.jpg',
            'Gabrielle Union': 'https://image.tmdb.org/t/p/w185/1UeaAGWmzmTPCZ9mYQVA27yTMPJ.jpg',
            'Kyle Cease': 'https://image.tmdb.org/t/p/w185/fcVmEbnYzgkFLqrUsBIitXzWJlz.jpg',
            'Heath Ledger': 'https://image.tmdb.org/t/p/w185/7YOTFvGOg2FwoLIjPhPNAWwaF5b.jpg'
          },
          backdrop_original: [
            'https://image.tmdb.org/t/p/original/oi5EvMTKxhUngCveced3dwx1ctF.jpg'
          ],
          clear_art: [],
          logo: [],
          banner: [],
          backdrop: [
            'https://image.tmdb.org/t/p/w1280/oi5EvMTKxhUngCveced3dwx1ctF.jpg'
          ],
          extra_fanart: []
        },
        actors: [],
        runtime: 97,
        type: 'movie'
      },
      _t: 'media',
      releases: [
        {
          status: 'done',
          files: {},
          _id: '3747d193f1e446bd993e7306236d16e3',
          media_id: '2fe328d5ffa442fd8caf2105d47fea0f',
          _rev: '00df41a7',
          _t: 'release',
          is_3d: false,
          last_edit: 1495336604,
          identifier: 'tt0147800.None.brrip',
          quality: 'brrip'
        },
        {
          status: 'done',
          files: {
            movie: [
              '/Library/Movies/10 Things I Hate About You (1999)/10 Things I Hate About You (1999) - HD 720p.mp4'
            ],
            subtitle: [
              '/Library/Movies/10 Things I Hate About You (1999)/10 Things I Hate About You (1999) - HD 720p.srt'
            ]
          },
          _id: '15690e2d63cb483dbee90c9f5d8c7d8c',
          media_id: '2fe328d5ffa442fd8caf2105d47fea0f',
          _rev: '000a8fce',
          _t: 'release',
          is_3d: false,
          last_edit: 1496536006,
          identifier: 'tt0147800.None.720p',
          quality: '720p'
        }
      ],
      title: '10 Things I Hate About You',
      _rev: '00e7d32b',
      profile_id: null,
      _id: '2fe328d5ffa442fd8caf2105d47fea0f',
      category_id: null,
      type: 'movie',
      identifiers: {
        imdb: 'tt0147800'
      }
    },
    {
      status: 'done',
      info: {
        rating: {
          imdb: [
            8.9,
            492094
          ]
        },
        genres: [
          'Drama',
          'Crime'
        ],
        tmdb_id: 389,
        plot: 'The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors\' prejudices and preconceptions about the trial, the accused, and each other.',
        tagline: 'Life is in their hands. Death is on their minds.',
        original_title: '12 Angry Men',
        actor_roles: {
          'Rudy Bond': 'Judge (uncredited)',
          'Ed Begley': 'Juror 10',
          'E.G. Marshall': 'Juror 4',
          'Jack Klugman': 'Juror 5',
          'James Kelly': 'Guard (uncredited)',
          'Jack Warden': 'Juror 7',
          'Edward Binns': 'Juror 6',
          'John Savoca': 'The Accused (uncredited)',
          'Robert Webber': 'Juror 12',
          'Lee J. Cobb': 'Juror 3',
          'Joseph Sweeney': 'Juror 9',
          'Walter Stocker': 'Man Waiting for Elevator (uncredited)',
          'Henry Fonda': 'Juror 8',
          'John Fiedler': 'Juror 2',
          'Billy Nelson': 'Court Clerk (uncredited)',
          'Martin Balsam': 'Juror 1',
          'George Voskovec': 'Juror 11'
        },
        via_imdb: true,
        mpaa: 'Approved',
        via_tmdb: true,
        titles: [
          '12 Angry Men',
          '12 разгневени мъже',
          'Οι δώδεκα ένορκοι',
          'Dwunastu gniewnych ludzi',
          '12 Kızgın Adam',
          'Twelve Angry Men',
          'La Parola ai Giurati',
          'Tizenkét dühös ember',
          'Valamiesten ratkaisu',
          'Doze Homens e uma Sentença',
          '十二怒漢',
          'Doce hombres sin piedad',
          'Douze hommes en colère',
          '12 hombres en pugna'
        ],
        imdb: 'tt0050083',
        year: 1957,
        images: {
          disc_art: [],
          poster: [
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODQwOTc5MDM2N15BMl5BanBnXkFtZTcwODQxNTEzNA@@._V1_.jpg'
          ],
          extra_thumbs: [],
          poster_original: [
            'https://image.tmdb.org/t/p/original/3W0v956XxSG5xgm7LB6qu8ExYJ2.jpg'
          ],
          landscape: [],
          actors: {
            'Rudy Bond': 'https://image.tmdb.org/t/p/w185/wNpO0orqR8rWz7tf11iKN0UhvGg.jpg',
            'Ed Begley': 'https://image.tmdb.org/t/p/w185/lnIapJ9Qwb2p2ijwXFvQtrE923w.jpg',
            'E.G. Marshall': 'https://image.tmdb.org/t/p/w185/iQnivIob2OiXuVCepECf72xS2tQ.jpg',
            'Jack Klugman': 'https://image.tmdb.org/t/p/w185/7OvZnRbj3DHxieaQpS0ZK5CITiP.jpg',
            'James Kelly': 'https://image.tmdb.org/t/p/w185/g8io175TK7Qp9Csp1JZ7lw3ME4i.jpg',
            'Jack Warden': 'https://image.tmdb.org/t/p/w185/7Pfj27pVjkQIu5HS85MlGdsl7MQ.jpg',
            'Edward Binns': 'https://image.tmdb.org/t/p/w185/77FaXwoiEOkKCDXDfvvG65Sx788.jpg',
            'John Savoca': 'https://image.tmdb.org/t/p/w185/53kG7cfLbvfSl7pCC9tMLm3IR0W.jpg',
            'Robert Webber': 'https://image.tmdb.org/t/p/w185/mg6SHDi5bi9C7pUwH14ZXxTnR7M.jpg',
            'Lee J. Cobb': 'https://image.tmdb.org/t/p/w185/535dOk8eUI97esLMunIXdG58jUu.jpg',
            'Joseph Sweeney': 'https://image.tmdb.org/t/p/w185/pP81t3COejh9znmvACHjS4dRmk.jpg',
            'Walter Stocker': 'https://image.tmdb.org/t/p/w185/cyBossMBqCom41MddHGq65FUjch.jpg',
            'Henry Fonda': 'https://image.tmdb.org/t/p/w185/sn3Fsm6l3xDAPHlO63ck2KOZ1BG.jpg',
            'John Fiedler': 'https://image.tmdb.org/t/p/w185/wjhOLcxWaum0JIBIRMZaQQjrhQw.jpg',
            'Billy Nelson': 'https://image.tmdb.org/t/p/w185/2MMi6zOYqwNx9UL0c33nLBFqCsO.jpg',
            'Martin Balsam': 'https://image.tmdb.org/t/p/w185/3lA1XlW9fsBCDYMMlgmvnHaWmOI.jpg',
            'George Voskovec': 'https://image.tmdb.org/t/p/w185/5whdVXSJTKgwztARJsspJdDufgm.jpg'
          },
          backdrop_original: [
            'https://image.tmdb.org/t/p/original/lH2Ga8OzjU1XlxJ73shOlPx6cRw.jpg'
          ],
          clear_art: [],
          logo: [],
          banner: [],
          backdrop: [
            'https://image.tmdb.org/t/p/w1280/lH2Ga8OzjU1XlxJ73shOlPx6cRw.jpg'
          ],
          extra_fanart: []
        },
        actors: [],
        runtime: 96,
        type: 'movie'
      },
      _t: 'media',
      releases: [
        {
          status: 'done',
          files: {},
          _id: '33b03654d32844efa25d19580334f756',
          media_id: '6f58dc4a02414b84941481a6074e1777',
          _rev: '00dfee54',
          _t: 'release',
          is_3d: false,
          last_edit: 1495336655,
          identifier: 'tt0050083..dvdr',
          quality: 'dvdr'
        },
        {
          status: 'done',
          files: {
            movie: [
              '/Library/Movies/12 Angry Men (1957)/12 Angry Men (1957) - HD 720p.m4v'
            ]
          },
          _id: '821ac5e141964c499c62b791b780330d',
          media_id: '6f58dc4a02414b84941481a6074e1777',
          _rev: '000af5d5',
          _t: 'release',
          is_3d: false,
          last_edit: 1496536046,
          identifier: 'tt0050083..720p',
          quality: '720p'
        }
      ],
      title: '12 Angry Men',
      _rev: '00e7db49',
      profile_id: null,
      _id: '6f58dc4a02414b84941481a6074e1777',
      category_id: null,
      type: 'movie',
      identifiers: {
        imdb: 'tt0050083'
      }
    }
  ],
  total: 978,
  empty: false,
  success: true
};
/* eslint-enable max-len */

const sampleAddMovieResponse = {
  movie: sampleMoviesResponse.movies[2],
  success: true
};

describe('api.couchpotato', () => {
  let cpApiStub, sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    cpApiStub = sandbox.stub(couchpotato.default(), 'get');

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
      cpApiStub.withArgs('movie.list').resolves(sampleMoviesResponse);
      cpApiStub.withArgs('movie.list', {search: '12 Angry Men'}).resolves({
        movies: [
          sampleMoviesResponse.movies[2]
        ]
      });
    });

    afterEach(() => {
      sandbox.reset();
    });

    it('should list all the movies', async () => {
      const movies = await couchpotato.list();
      assert.equal(movies.length, 3);
    });

    it('should list just movies with matching titles', async () => {
      const movies = await couchpotato.list('12 Angry Men');
      assert.equal(movies.length, 1);
    });

    it('should format the movie response to use standardized keys', async () => {
      const movies = await couchpotato.list();
      assert.deepEqual(Object.keys(movies[0]),
          ['title', 'year', 'tmdbId', 'imdbId', 'status', 'quality']);
    });

    it('should fill in the correct data in the correct fields', async () => {
      const [movie] = await couchpotato.list();

      assert.deepEqual(movie, {
        title: '10 Cloverfield Lane',
        year: 2016,
        tmdbId: 333371,
        imdbId: 'tt1179933',
        status: 'done',
        quality: '1080p'
      });
    });
  });

  describe('.search()', () => {
    beforeEach(() => {
      cpApiStub.withArgs('movie.search', {q: '10'}).resolves(sampleMoviesResponse);
    });

    afterEach(() => {
      sandbox.reset();
    });

    it('should return a formatted result', async () => {
      const movies = await couchpotato.search('10');

      assert.deepEqual(movies[1], {
        title: '10 Things I Hate About You',
        year: 1999,
        tmdbId: 4951,
        imdbId: 'tt0147800',
        status: 'done',
        quality: 'brrip'
      });
    });
  });

  describe('.add()', () => {
    let movie;

    beforeEach(() => {
      movie = {
        title: '12 Angry Men',
        year: 1957,
        tmdbId: 389,
        imdbId: 'tt0050083',
        status: 'done',
        quality: 'dvdr'
      };

      cpApiStub.withArgs('movie.add', {title: movie.title, identifier: movie.imdbId})
          .resolves(sampleAddMovieResponse);
    });

    afterEach(() => {
      sandbox.reset();
    });

    it('should return a correct response', async () => {
      const resp = await couchpotato.add(movie);
      assert.deepEqual(resp, sampleAddMovieResponse);
    });
  });
});
