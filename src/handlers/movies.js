import getProvider, {PROVIDER_TYPE} from '~/api/getProvider.js';

import buildReprompt from '~/lib/buildReprompt.js';
import parseDate from '~/lib/parseDate.js';

import {
  ADD_NOT_FOUND,
  ADD_PROMPT,
  ALREADY_WANTED,
  NO_MOVIE_FOUND,
  NO_MOVIE_SLOT
} from '~/responses/movies.js';

export const NUM_RESULTS = 5;

export async function handleFindMovieIntent(req, resp) {
  if (!req.slot('movieName')) {
    return resp.say(NO_MOVIE_SLOT()).send();
  }

  const api = getProvider(PROVIDER_TYPE.MOVIES);
  let movies = await api.list(req.slot('movieName'));

  if (!movies || !movies.length) {
    const query = buildQuery(req);
    resp.say(NO_MOVIE_FOUND(query));

    movies = await api.search(query);
    if (movies) {
      const [topResult] = movies;
      resp
        .say(ADD_PROMPT(topResult.title, topResult.year))
        .session('promptData', buildReprompt(movies, PROVIDER_TYPE.MOVIES))
        .shouldEndSession(false);
    }

    resp.send();
  }
  else {
    const [result] = movies;
    resp
      .say(ALREADY_WANTED(result.title, result.year))
      .send();
  }
}

export function handleAddMovieIntent(req, resp) {
  if (!req.slot('movieName')) {
    return resp.say(NO_MOVIE_SLOT()).send();
  }

  const api = getProvider(PROVIDER_TYPE.MOVIES);
  const query = buildQuery(req);

  return api.search(query).then((movies) => {
    const movieName = req.slot('movieName');

    if (!movies || !movies.length) {
      resp.say(ADD_NOT_FOUND(movieName));
    }
    else {
      const [topResult] = movies;
      resp
        .say(ADD_PROMPT(topResult.title, topResult.year))
        .session('promptData', buildReprompt(movies, PROVIDER_TYPE.MOVIES))
        .shouldEndSession(false);
    }

    resp.send();
  });
}

function buildQuery(req) {
  const movieName = req.slot('movieName');
  const releaseDate = parseDate(req.slot('releaseDate'));

  return releaseDate ? `${movieName} ${releaseDate.year}` : movieName;
}
