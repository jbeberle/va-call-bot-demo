const PREAMBLE = require('./preamble');

/**
 * each case is an element within an array with the following shape
 * {
 *   testIt: string representing the 'it' for a test
 *   steps: array of step objects
 *   only: optional, if true will cause this test to be the only test ran - only one test can have this
 *   skip: optional, if true will cause this test to be skipped
 *   axiosQNAExpectedPost: optional, if set will check for a post to QNA
 * }
 *******
 * each step has the following shape
 * {
 *  expectedReply: // required string for the bot's expected message
 *  dataToBeSent: // optional value, string or object, to send to the bot this would be in response to the expectedReply
 * }
 */

module.exports = [
  {
    testIt: 'Should show account education for Do I Need an account?',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'Do I need an account?',
        axiosQNAExpectedPost: 'account-education',
        expectedReply: 'some qna answer',
      },
    ],
  },
];
