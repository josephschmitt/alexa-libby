'use strict';

import Alexa from 'alexa-app';

import handleLaunchIntent, {
  handleFindMovieIntent,
  handleAddMovieIntent,
  handleAddMovieDateIntent,
  handleYesIntent,
  handleNoIntent,
  handleCancelIntent,
  handleHelpIntent
} from './handlers.js';

const app = new Alexa.app('couchPotato');

app.launch(handleLaunchIntent);
app.intent('FindMovie', handleFindMovieIntent);
app.intent('AddMovie', handleAddMovieIntent);
app.intent('AddMovieDate', handleAddMovieDateIntent);
app.intent('AMAZON.YesIntent', handleYesIntent);
app.intent('AMAZON.NoIntent', handleNoIntent);
app.intent('AMAZON.CancelIntent', handleCancelIntent);
app.intent('AMAZON.HelpIntent', handleHelpIntent);

app.post = function(request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

export default app;
