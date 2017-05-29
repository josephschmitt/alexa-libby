import {
  ADD_NOT_FOUND,
  ADD_PROMPT
} from '~/lib/responses.js';
import buildReprompt from '~/lib/buildReprompt.js';

export default function sendSearchResponse(movies, movieName, resp) {
  if (!movies || !movies.length > 0) {
    return resp.say(ADD_NOT_FOUND(movieName));
  }

  const [topResult] = movies;
  return resp
    .say(ADD_PROMPT(topResult.original_title, topResult.year))
    .session('promptData', buildReprompt(movies))
    .shouldEndSession(false);
}
