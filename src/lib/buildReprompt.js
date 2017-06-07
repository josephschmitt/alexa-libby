import {
  REPROMPT_END,
  REPROMPT_NO,
  REPROMPT_YES
} from '~/lib/responses.js';

export default function buildReprompt(searchResults, mediaType) {
  const [topResult] = searchResults;
  const promptData = {
    searchResults,
    mediaType,
    yesAction: 'addMedia',
    yesResponse: REPROMPT_YES(topResult.title, topResult.year)
  };

  if (searchResults.length > 1) {
    promptData.noAction = 'suggestNext';
    promptData.noResponse = REPROMPT_NO(searchResults[1].title, searchResults[1].year);
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = REPROMPT_END;
  }

  return promptData;
}
