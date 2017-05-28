import buildPrompt from '~/lib/buildPrompt.js';

export default function sendSearchResponse(movies, movieName, resp) {
  if (!movies || !movies.length > 0) {
    return resp.say('No movie found for ' + movieName).send();
  }

  resp
    .say(['Add', movies[0].original_title, '(' + movies[0].year + ')', 'to your list?'].join(' '))
    .session('promptData', buildPrompt(movies))
    .shouldEndSession(false)
    .send();
}
