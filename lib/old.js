var alexa = require('alexa-app');
var request = require('request');
var dotenv = require('dotenv').config();
var CouchPotato = require('node-couchpotato');

var app = new alexa.app();
var cp = new CouchPotato({
    url: dotenv.CP_URL,
    apikey: dotenv.CP_API_KEY,
    debug: true
});

function buildNextMovieSuggestionPrompt(movies) {
  var promptData = {
      searchResults: movies.slice(0, 5),
      yesAction  : 'addMovie',
      yesResponse: 'Added ' + movies[0].original_title + ' (' + movies[0].year + ')' + ' to your list of movies to download.'
  };

  if (movies.length > 1) {
    promptData.noAction = 'suggestNextMovie';
    promptData.noResponse = 'Ok, did you mean ' + movies[1].original_title + ' (' + movies[1].year + ')' + '?';
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = 'Ok. I\'m out of suggestions. Sorry about that.';
  }

  return promptData;
}

function formatMovieSearchResponse(movies, resp) {
  if(!movies || !movies.length) {
      resp.say("No movie found for " + movieName);
      return resp.send();
  }

  var speechText = 'Add ' + movies[0].original_title + ' (' + movies[0].year + ')' + ' to your list?';
  // console.log('movie found', speechText);
  // console.log('reprompt data',  buildNextMovieSuggestionPrompt(movies.slice(0, 5)));

  resp
    .say(speechText)
    .session('promptData', buildNextMovieSuggestionPrompt(movies.slice(0, 5)))
    .shouldEndSession(false)
    .send();
}

app.intent('FindMovie', function (req, resp) {
  var movieName = req.slot('movieName');

  // console.log('search for movie in list', movieName);
  cp.movie.list({search: movieName, limit_offset: 5}).then(function (searchResp) {
    var movies = searchResp.movies;
    var result;
    var speechText;

    if (!movies || !movies.length) {
      speechText = "Couldn't find " + movieName + " queued for download. ";
      resp.say(speechText);

      // console.log('no movie found', speechText);

      cp.movie.search(movieName).then(function (searchResults) {
        formatMovieSearchResponse(searchResults, resp);
      });
    }
    else {
      result = movies[0].info;
      speechText = 'It looks like ' + result.original_title + ' (' + result.year + ')' + ' is already on your list.';

      // console.log('movie found', speechText);

      resp
        .say(speechText)
        .send();
    }

    return false;
    // console.log('reprompt data',  buildNextMovieSuggestionPrompt(movies.slice(0, 5)));
  });

  return false;
});

app.intent('AddMovie', function (req, resp) {
  var movieName = req.slot('movieName');

  // console.log('search for movie', movieName);
  cp.movie.search(movieName).then(function (movies) {
    formatMovieSearchResponse(movies, resp);
  });

  return false;
});

app.intent('AMAZON.YesIntent', function (req, resp) {
  var promptData = req.session('promptData');

  if (!promptData) {
      console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
      return resp.send();
  }

  if (promptData.yesAction === 'addMovie') {
    // console.log('promptData', promptData);
    var movie = promptData.searchResults[0];

    // console.log('Add the movie', movie.original_title);
    cp.movie.add({
      title: movie.titles[0],
      identifier: movie.imdb
    }).then(function () {
      resp
        .say(promptData.yesResponse)
        .send();
    });
  }
  else {
    console.log("Got an unexpected yesAction. PromptData:");
    console.log(promptData);
    return resp.send();
  }

  return false;
});

app.intent('AMAZON.NoIntent', function (req, resp) {
  var promptData = req.session('promptData');

  if (!promptData) {
      console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
      return resp.send();
  }

  if (promptData.noAction === 'endSession') {
    return resp.say(promptData.noResponse).send();
  }
  else if (promptData.noAction === 'suggestNextMovie') {
    var movies = promptData.searchResults;
    return resp
        .say(promptData.noResponse)
        .session('promptData', buildNextMovieSuggestionPrompt(movies.slice(1)))
        .shouldEndSession(false)
        .send();
  }
  else {
      console.log("Got an unexpected noAction. PromptData:");
      console.log(promptData);
      return resp.send();
  }

  return false;
});

app.intent('AMAZON.CancelIntent', function (req, resp) {
  resp.shouldEndSession(true).send();
});

exports.handler = app.lambda();
