import tmpl from '~/lib/tmpl.js';

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
export const ALREADY_WANTED = tmpl`It looks like ${0} (${1}) is already on your list.`;

/** ${0: Search query} */
export const NO_MOVIE_FOUND = tmpl`Couldn't find ${0} in your wanted list.`;

export const NO_MOVIE_SLOT = tmpl`Sorry, I couldn't understand the movie title I heard. Please try
    again with different phrasing.`;

export const REPROMPT_END = tmpl`Ok, I'm out of suggestions.`;

/** ${0: Movie Title}, ${1: Release date} */
export const REPROMPT_NO = tmpl`Ok, did you mean ${0} (${1})?`;

/** ${0: Movie Title}, ${1: Release date} */
export const REPROMPT_YES = tmpl`Added ${0} (${1}) to your wanted list.`;
