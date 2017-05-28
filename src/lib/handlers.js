import CouchPotato from 'node-couchpotato';

import buildPrompt from '~/lib/buildPrompt.js';
import buildMovieQuery from '~/lib/buildMovieQuery.js';
import sendSearchResponse from '~/lib/sendSearchResponse.js';
import formatSearchResults from '~/lib/formatSearchResults.js';

import {
  WELCOME_DESCRIPTION,
  HELP_RESPONSE,
  CANCEL_RESPONSE
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
    .say(WELCOME_DESCRIPTION)
    .say(HELP_RESPONSE)
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
      resp.say(`Couldn't find ${query} queued for download. `);

      cp.movie.search(query).then((searchResults) => {
        sendSearchResponse(searchResults, null, resp);
      });
    }
    else {
      const result = movies[0].info;
      resp
        .say(`It looks like ${result.original_title} (${result.year}) is already on your list.`)
        .send();
    }
  });
}

export function handleAddMovieIntent(req, resp) {
  return cp.movie.search(buildMovieQuery(req), NUM_RESULTS).then((movies) => {
    const formattedResults = formatSearchResults(movies);
    const movieName = req.slot('movieName');

    sendSearchResponse(formattedResults, movieName, resp);
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
      .session('promptData', buildPrompt(movies.slice(1)))
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
  resp.say(CANCEL_RESPONSE).shouldEndSession(true).send();
}

export function handleHelpIntent(req, resp) {
  resp.say(HELP_RESPONSE).send();
}
