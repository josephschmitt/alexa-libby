import Alexa from 'alexa-app';

import * as generalHandlers from '~/handlers/general.js';
import * as movieHandlers from '~/handlers/movies.js';
import * as showHandlers from '~/handlers/shows.js';

const app = new Alexa.app('libby');

app.launch(generalHandlers.handleLaunchIntent);

app.intent('FindMovie', movieHandlers.handleFindMovieIntent);
app.intent('AddMovie', movieHandlers.handleAddMovieIntent);

app.intent('FindShow', showHandlers.handleFindShowIntent);
app.intent('AddShow', showHandlers.handleAddShowIntent);

app.intent('AMAZON.YesIntent', generalHandlers.handleYesIntent);
app.intent('AMAZON.NoIntent', generalHandlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', generalHandlers.handleCancelIntent);
app.intent('AMAZON.HelpIntent', generalHandlers.handleHelpIntent);

app.post = function (request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

export default app.lambda();
