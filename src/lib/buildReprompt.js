import {PROVIDER_TYPE} from '~/api/getProvider.js';

import * as movieResponses from '~/responses/movies.js';
import * as showResponses from '~/responses/shows.js';

export default function buildReprompt(searchResults, providerType) {
  const [topResult, nextResult] = searchResults;
  const responses = {};

  if (providerType === PROVIDER_TYPE.MOVIES) {
    Object.assign(responses, {
      yes: movieResponses.REPROMPT_YES(topResult.title, topResult.year),
      no: nextResult ? movieResponses.REPROMPT_NO(nextResult.title, nextResult.year) : '',
      end: movieResponses.REPROMPT_END()
    });
  }
  else {
    Object.assign(responses, {
      yes: showResponses.REPROMPT_YES(topResult.title),
      no: nextResult ? showResponses.REPROMPT_NO(nextResult.title) : '',
      end: showResponses.REPROMPT_END()
    });
  }

  const promptData = {
    searchResults: searchResults.slice(1),
    providerType,
    yesAction: 'addMedia',
    yesResponse: responses.yes
  };

  if (nextResult) {
    promptData.noAction = 'suggestNext';
    promptData.noResponse = responses.no;
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = responses.end;
  }

  return promptData;
}
