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
    'add {the movie |the film }{-|movieName}{ to the list| to the wanted list|}',

    // Movie and release date
    'add {the movie |the film }{-|movieName} {from|released in|year|came out in} {-|releaseDate}{ to the list| to the wanted list|}',
  ]
};
