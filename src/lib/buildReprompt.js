import {
  REPROMPT_END,
  REPROMPT_NO,
  REPROMPT_YES
} from '~/lib/responses.js';

export default function buildReprompt(movies) {
  const [topResult] = movies;
  const promptData = {
    searchResults: movies,
    yesAction: 'addMovie',
    yesResponse: REPROMPT_YES(topResult.original_title, topResult.year)
  };

  if (movies.length > 1) {
    promptData.noAction = 'suggestNextMovie';
    promptData.noResponse = REPROMPT_NO(movies[1].original_title, movies[1].year);
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = REPROMPT_END;
  }

  return promptData;
}
