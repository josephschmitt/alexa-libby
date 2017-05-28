export default function buildPrompt(movies) {
  const promptData = {
    searchResults: movies,
    yesAction: 'addMovie',
    yesResponse: 'Added ' + movies[0].original_title + ' (' + movies[0].year + ')' +
        ' to your list of movies to download.'
  };

  if (movies.length > 1) {
    promptData.noAction = 'suggestNextMovie';
    promptData.noResponse = 'Ok, did you mean ' + movies[1].original_title +
        ' (' + movies[1].year + ')' + '?';
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = 'Ok. I\'m out of suggestions. Sorry about that.';
  }

  return promptData;
}
