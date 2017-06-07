import tmpl from '~/lib/tmpl.js';

/** ${0: Show Name} */
export const ADD_SHOW = tmpl`Add ${0} to your list?`;

/** ${0: Show Name} */
export const ALREADY_WANTED = tmpl`It looks like ${0} is already on your list.`;

/** ${0: Search query} */
export const NO_SHOW_FOUND = tmpl`No show found for ${0}`;

/** ${0: Show Name} */
export const NO_SHOW_QUEUED = tmpl`Couldn't find ${0} queued for download.`;

export const REPROMPT_END = tmpl`Ok. I'm out of suggestions. Sorry about that.`;

/** ${0: Show Name} */
export const REPROMPT_NO = tmpl`Ok, did you mean ${0}?`;

/** ${0: Show Name} */
export const REPROMPT_YES = tmpl`Added ${0} to your list of shows to download.`;
