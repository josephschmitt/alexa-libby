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
export default function tmpl(strs) {
  return (...args) => {
    return strs.map((str, i) => {
      return str + (args[i] || '');
    }).join('');
  };
}
