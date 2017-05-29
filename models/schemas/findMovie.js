module.exports = {
  name: 'FindMovie',
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
    '{is|if} {movieSamples|movieName} {on the list|is on the list|already|is already|is wanted|is in wanted}',

    // Movie and release date
    '{is|if} {movieSamples|movieName} {from|released in|year|came out in} {-|releaseDate} {on the list|already|in wanted|in the wanted list}',
    '{is|if} the {-|releaseDate} {movie|film} {movieSamples|movieName} {on the list|in wanted|in the wanted list}',
  ]
};
