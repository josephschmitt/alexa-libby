import assert from 'assert';

import parseDate from '~/lib/parseDate.js';

describe('lib.parseDate', () => {
  it('should return null if you dont give it a date string', () => {
    assert.equal(parseDate(), null);
  });

  it('should parse a date string and return an object with year, month, and date', () => {
    assert.deepEqual(parseDate('2017-06-15'), {
      year: 2017,
      month: 6,
      date: 15
    });
  });

  it('should exclude a date if it is not in the string', () => {
    assert.deepEqual(parseDate('2017-06'), {
      year: 2017,
      month: 6,
      date: null
    });
  });

  it('should exclude a month if it is not in the string', () => {
    assert.deepEqual(parseDate('2017'), {
      year: 2017,
      month: null,
      date: null
    });
  });
});
