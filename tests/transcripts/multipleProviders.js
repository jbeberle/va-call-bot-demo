const PREAMBLE = require('./preamble');
const generateQnaIt = require('./helpers/generateQnaIt');

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

const ID_ME_SWITCHBOARD =
  'What kind of help with ID&period;me are you looking for today?';
const ACCOUNT_TYPE =
  'Do you want to create a new ID&period;me account, or do you need help with an existing account?';
const PATH_TO_SWITCHBOARD_A = [
  ...PREAMBLE,
  {
    dataToBeSent: 'ID.me',
    expectedReply: ACCOUNT_TYPE,
  },
  {
    dataToBeSent: 'Help with my account',
    expectedReply: ID_ME_SWITCHBOARD,
  },
];

