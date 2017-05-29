import CouchPotato from 'node-couchpotato';

import buildReprompt from '~/lib/buildReprompt.js';
import buildMovieQuery from '~/lib/buildMovieQuery.js';
import buildSearchResponse from '~/lib/buildSearchResponse.js';
import formatSearchResults from '~/lib/formatSearchResults.js';

import {
  ALREADY_ON_LIST,
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  NO_MOVIE_FOUND,
  WELCOME_DESCRIPTION
} from '~/lib/responses.js';

const config = require('dotenv').config();

export const NUM_RESULTS = 5;

export const cp = new CouchPotato({
  url: config.CP_URL,
  apikey: config.CP_API_KEY,
  debug: true
});

export default function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleFindMovieIntent(req, resp) {
  const query = buildMovieQuery(req);

  return cp.movie.list({
    search: query,
    limit_offset: NUM_RESULTS
  }).then((searchResp) => {
    const movies = searchResp.movies;

    if (!movies || !movies.length) {
      resp.say(NO_MOVIE_FOUND(query));

      cp.movie.search(query).then((searchResults) => {
        buildSearchResponse(searchResults, null, resp).send();
      });
    }
    else {
      const result = movies[0].info;
      resp
        .say(ALREADY_ON_LIST(result.original_title, result.year))
        .send();
    }
  });
}

export function handleAddMovieIntent(req, resp) {
  return cp.movie.search(buildMovieQuery(req), NUM_RESULTS).then((movies) => {
    const formattedResults = formatSearchResults(movies);
    const movieName = req.slot('movieName');

    buildSearchResponse(formattedResults, movieName, resp).send();
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

    return cp.movie.add({
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
