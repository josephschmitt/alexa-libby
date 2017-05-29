module.exports = {
  name: 'AddMovie',
  slots: [
    {
      name: 'movieName',
      type: 'AMAZON.Movie'
    },
    {
      name: 'releaseDate',
      type: 'AMAZON.DATE'
    }
  ],
  samples: [
    // Just the movie name
    'add {movieSamples|movieName}',
    'add {movie|film} {movieSamples|movieName}',
    'add the {movie|film} {movieSamples|movieName}',

    // Movie and release date
    'add {movieSamples|movieName} {from|released in|year|came out in} {-|releaseDate}',
    'add the {-|releaseDate} {movie|film} {movieSamples|movieName}',
  ]
};
