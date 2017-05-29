import CouchPotato from 'couchpotato-api';

import buildReprompt from '~/lib/buildReprompt.js';
import buildMovieQuery from '~/lib/buildMovieQuery.js';
import formatSearchResults from '~/lib/formatSearchResults.js';

import {
  ADD_NOT_FOUND,
  ADD_PROMPT,
  ALREADY_WANTED,
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  NO_MOVIE_FOUND,
  WELCOME_DESCRIPTION
} from '~/lib/responses.js';

const config = require('dotenv').config();

export const NUM_RESULTS = 5;

export const cp = new CouchPotato({
  hostname: config.CP_URL,
  apiKey: config.CP_API_KEY,
  port: config.CP_PORT
});

export default function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleFindMovieIntent(req, resp) {
  const query = buildMovieQuery(req);

  return cp.get('movie.list', {
    search: query,
    limit_offset: NUM_RESULTS
  }).then(({movies}) => {
    if (!movies || !movies.length) {
      resp.say(NO_MOVIE_FOUND(query));

      return cp.get('movie.search', {q: query}).then(({movies}) => {
        if (movies) {
          const [topResult] = movies;
          resp
            .say(ADD_PROMPT(topResult.original_title, topResult.year))
            .session('promptData', buildReprompt(movies))
            .shouldEndSession(false);
        }

        resp.send();
      });
    }
    else {
      const result = movies[0].info;
      resp
        .say(ALREADY_WANTED(result.original_title, result.year))
        .send();
    }
  });
}

export function handleAddMovieIntent(req, resp) {
  return cp.get('movie.search', {
    q: buildMovieQuery(req)
  }, NUM_RESULTS).then(({movies}) => {
    movies = formatSearchResults(movies);
    const movieName = req.slot('movieName');

    if (!movies || !movies.length) {
      resp.say(ADD_NOT_FOUND(movieName));
    }
    else {
      const [topResult] = movies;
      resp
        .say(ADD_PROMPT(topResult.original_title, topResult.year))
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
    const movie = promptData.searchResults[0];

    return cp.get('movie.add', {
      title: movie.titles[0],
      identifier: movie.imdb
    }).then(() => {
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
