'use strict';

var handlers = require('./handlers.js');

var alexa = require('alexa-app');
var app = new alexa.app('couchPotato');

app.launch(handlers.handleLaunchIntent);
app.intent('FindMovie', handlers.handleFindMovieIntent);
app.intent('AddMovie', handlers.handleAddMovieIntent);
app.intent('AMAZON.YesIntent', handlers.handleYesIntent);
app.intent('AMAZON.NoIntent', handlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', handlers.handleCancelIntent);

module.exports = app;
