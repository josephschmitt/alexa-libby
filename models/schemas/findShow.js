module.exports = {
  name: 'FindShow',
  slots: [
    {
      name: 'showName',
      type: 'AMAZON.TVSeries',
      samples: []
    }
  ],
  samples: [
    '{is|if} {the show |the series |}{-|showName} {on the list|is on the list|already|is already|is wanted|is in wanted}',
  ]
};
