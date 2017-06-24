module.exports = {
  name: 'FindMovie',
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
    '{is|if} {the |}{movie |film }{-|movieName} {on the list|is on the list|already|is already|is wanted|is in wanted}',

    // Movie and release date
    '{is|if} {the |}{movie |film }{-|movieName} {from|released in|year|came out in} {-|releaseDate} {on the list|is on the list|already|is already|is wanted|is in wanted}',
  ]
};
