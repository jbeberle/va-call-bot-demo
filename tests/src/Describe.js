class Describe {
  /**
   *
   * @param {String} statement what should the describe print?
   * @param {Array} tests
   * @param {Object} options - optional options object
   * @param {Boolean} options.skip if true will skip tests - defaults to false
   * @param {Boolean} options.only if true will skip other tests - defaults to false
   */
  constructor(statement, tests, { skip = false, only = false } = {}) {
    this.describeMessage = statement;
    this.skip = skip;
    this.only = only;
    this.tests = tests;
  }
}

module.exports = Describe;
