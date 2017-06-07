import Alexa from 'alexa-app';

import * as amazonHandlers from '~/handlers/amazon.js';
import * as movieHandlers from '~/handlers/movie.js';

const app = new Alexa.app('libby');

app.launch(amazonHandlers.handleLaunchIntent);

app.intent('FindMovie', movieHandlers.handleFindMovieIntent);
app.intent('AddMovie', movieHandlers.handleAddMovieIntent);

app.intent('AMAZON.YesIntent', amazonHandlers.handleYesIntent);
app.intent('AMAZON.NoIntent', amazonHandlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', amazonHandlers.handleCancelIntent);
app.intent('AMAZON.HelpIntent', amazonHandlers.handleHelpIntent);

app.post = function (request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

export default app.lambda();
