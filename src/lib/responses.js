/**
 * This module contains functions to help standardize the responses used to send back to ASK. The
 * constants are all functions, built by the `tmpl` tag function, documented below. They take
 * parameters and replace them with the data they are provided. Each index in the template string
 * corresponds to the parameter given. So `${1}` is the 2nd parameter when you execute the function.
 *
 * Responses that don't take any parameters are still functions, for the sake of consistency.
 */

/** ${0: Movie Title} */
export const ADD_NOT_FOUND = tmpl`No movie found for ${0}`;

/** ${0: Movie Title}, ${1: Release date} */
export const ADD_PROMPT = tmpl`Add ${0} (${1}) to your list?`;

/** ${0: Movie Title}, ${1: Release date} */
export const ALREADY_ON_LIST = tmpl`It looks like ${0} (${1}) is already on your list.`;

export const CANCEL_RESPONSE = tmpl`Exiting Couch Potato`;

export const HELP_RESPONSE = tmpl`You can ask Couch Potato about the movies in your queue or add
    new movies to it. Try asking "Is The Godfather on the list?". If it's not and you want to add
    it, try saying "Add The Godfather"`;

/** ${0: Search query} */
export const NO_MOVIE_FOUND = tmpl`Couldn't find ${0} in your wanted list.`;

export const REPROMPT_END = tmpl`Ok, I'm out of suggestions.`;

/** ${0: Movie Title}, ${1: Release date} */
export const REPROMPT_NO = tmpl`Ok, did you mean ${0} (${1})?`;

/** ${0: Movie Title}, ${1: Release date} */
export const REPROMPT_YES = tmpl`Added ${0} (${1}) to your wanted list.`;

export const WELCOME_DESCRIPTION = tmpl`This skill allows you to manage your Couch Potato movie
    list.`;

/**
 * Template literal tag function. Returns a function that can be called with parameters to build
 * a string response. The tagged template returns a function that you can then call with parameters
 * to build out yours tring.
 *
 * Usage:
 *   respond`This is ${0} reponse ${1} I made.`('an awesome', 'function')
 * Or:
 *   const respFnc = respond`This is ${0} reponse ${1} I made.`;
 *   respFnc('an awesome', 'function');
 *
 * Returns:
 *   'This is an awesome response function I made.'
 *
 * @param {Array} strs Array of strings from the template.
 * @returns {Function}
 */
function tmpl(strs) {
  return (...args) => {
    return strs.map((str, i) => {
      return str + (args[i] || '');
    }).join('');
  };
}
