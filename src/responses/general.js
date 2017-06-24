import tmpl from '~/lib/tmpl.js';

/**
 * This module contains functions to help standardize the responses used to send back to ASK. The
 * constants are all functions, built by the `tmpl` tag function, documented below. They take
 * parameters and replace them with the data they are provided. Each index in the template string
 * corresponds to the parameter given. So `${1}` is the 2nd parameter when you execute the function.
 *
 * Responses that don't take any parameters are still functions, for the sake of consistency.
 */

export const CANCEL_RESPONSE = tmpl`Exiting Couch Potato`;

export const HELP_RESPONSE = tmpl`You can ask Couch Potato about the movies in your queue or add
new movies to it. Try asking "Is The Godfather on the list?". If it's not and you want to add
it, try saying "Add The Godfather"`;

export const WELCOME_DESCRIPTION = tmpl`This skill allows you to manage your Couch Potato movie
list.`;
