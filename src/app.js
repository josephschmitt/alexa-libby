import Alexa from 'alexa-app';

import * as movieHandlers from '~/lib/movieHandlers.js';

const app = new Alexa.app('libby');

app.launch(movieHandlers.default);
app.intent('FindMovie', movieHandlers.handleFindMovieIntent);
app.intent('AddMovie', movieHandlers.handleAddMovieIntent);
app.intent('AMAZON.YesIntent', movieHandlers.handleYesIntent);
app.intent('AMAZON.NoIntent', movieHandlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', movieHandlers.handleCancelIntent);
app.intent('AMAZON.HelpIntent', movieHandlers.handleHelpIntent);

app.post = function (request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

export default app.lambda();
