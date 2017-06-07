module.exports = {
  name: 'AddMovie',
  slots: [
    {
      name: 'movieName',
      type: 'AMAZON.Movie',
      samples: []
    },
    {
      name: 'releaseDate',
      type: 'AMAZON.DATE',
      samples: []
    }
  ],
  samples: [
    // Just the movie name
    'add {the |}{movie |film }{-|movieName}{ to the list| to the wanted list|}',

    // Movie and release date
    'add {the |}{movie |film }{-|movieName} {from|released in|yearcame out in} {-|releaseDate}{ to the list| to the wanted list|}',
  ]
};
