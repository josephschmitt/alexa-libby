import getProvider from '~/api/getProvider.js';

import buildReprompt from '~/lib/buildReprompt.js';
import buildMovieQuery from '~/lib/buildMovieQuery.js';

import {
  ADD_NOT_FOUND,
  ADD_PROMPT,
  ALREADY_WANTED,
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  NO_MOVIE_FOUND,
  NO_MOVIE_SLOT,
  WELCOME_DESCRIPTION
} from '~/lib/responses.js';

export const NUM_RESULTS = 5;

export default function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleFindMovieIntent(req, resp) {
  if (!req.slot('movieName')) {
    return resp.say(NO_MOVIE_SLOT()).send();
  }

  const api = getProvider('movies');
  const query = buildMovieQuery(req);

  return api.list().then((movies) => {
    if (!movies || !movies.length) {
      resp.say(NO_MOVIE_FOUND(query));

      return api.search(query).then((movies) => {
        if (movies) {
          const [topResult] = movies;
          resp
            .say(ADD_PROMPT(topResult.title, topResult.year))
            .session('promptData', buildReprompt(movies))
            .shouldEndSession(false);
        }

        resp.send();
      });
    }
    else {
      const [result] = movies;
      resp
        .say(ALREADY_WANTED(result.title, result.year))
        .send();
    }
  });
}

export function handleAddMovieIntent(req, resp) {
  if (!req.slot('movieName')) {
    return resp.say(NO_MOVIE_SLOT()).send();
  }

  const api = getProvider('movies');
  const query = buildMovieQuery(req);

  return api.search(query).then((movies) => {
    const movieName = req.slot('movieName');

    if (!movies || !movies.length) {
      resp.say(ADD_NOT_FOUND(movieName));
    }
    else {
      const [topResult] = movies;
      resp
        .say(ADD_PROMPT(topResult.title, topResult.year))
        .session('promptData', buildReprompt(movies))
        .shouldEndSession(false);
    }

    resp.send();
  });
}

export function handleYesIntent(req, resp) {
  const promptData = req.session('promptData');

  if (!promptData) {
    console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
    resp.send();
  }
  else if (promptData.yesAction === 'addMovie') {
    const api = getProvider('movies');
    const movie = promptData.searchResults[0];

    return api.add(movie).then(() => {
      resp
        .say(promptData.yesResponse)
        .send();
    });
  }
  else {
    console.log('Got an unexpected yesAction. PromptData:');
    console.log(promptData);
    resp.send();
  }
}

export function handleNoIntent(req, resp) {
  const promptData = req.session('promptData');

  if (!promptData) {
    console.log('Got a AMAZON.NoIntent but no promptData. Ending session.');
    resp.send();
  }
  else if (promptData.noAction === 'endSession') {
    resp.say(promptData.noResponse).send();
  }
  else if (promptData.noAction === 'suggestNextMovie') {
    const movies = promptData.searchResults;
    resp
      .say(promptData.noResponse)
      .session('promptData', buildReprompt(movies.slice(1)))
      .shouldEndSession(false)
      .send();
  }
  else {
    console.log('Got an unexpected noAction. PromptData:');
    console.log(promptData);
    resp.send();
  }
}

export function handleCancelIntent(req, resp) {
  resp.say(CANCEL_RESPONSE()).shouldEndSession(true).send();
}

export function handleHelpIntent(req, resp) {
  resp.say(HELP_RESPONSE()).send();
}
