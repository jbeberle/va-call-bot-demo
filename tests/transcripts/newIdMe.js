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

const ID_ME_SWITCHBOARD =
  'What kind of help with ID&period;me are you looking for today?';
const ID_ME_NEW_NONE_OF_THESE =
  'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact ID&period;me?';
const ACCOUNT_TYPE =
  'Do you want to create a new ID&period;me account, or do you need help with an existing account?';
const PATH_TO_SWITCHBOARD_A = [
  ...PREAMBLE,
  {
    dataToBeSent: 'ID.me',
    expectedReply: ACCOUNT_TYPE,
  },
  {
    dataToBeSent: 'Create a new account',
    expectedReply: ID_ME_SWITCHBOARD,
  },
];

module.exports = [
  {
    testIt: 'Should have 1 switchboard for new ID.me accounts',
    steps: [...PATH_TO_SWITCHBOARD_A],
  },
  {
    testIt: 'For new ID.me accounts click "Create my account"',
    steps: [
      ...PATH_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Create my account',
        axiosQNAExpectedPost: 'id-me-new-content1',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For new ID.me accounts click "Am I eligible?"',
    steps: [
      ...PATH_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Am I eligible?',
        axiosQNAExpectedPost: 'id-me-new-content2',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For new ID.me accounts click "Verify my identity"',
    steps: [
      ...PATH_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Verify my identity',
        axiosQNAExpectedPost: 'id-me-verify-identity',
        expectedReply: 'some qna answer',
      },
    ],
  },

  {
    testIt: 'For new ID.me accounts click "None of these"',
    steps: [
      ...PATH_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'None of these',
        expectedReply: ID_ME_NEW_NONE_OF_THESE,
      },
    ],
  },
  {
    testIt:
      'Should be able to navigate back to account type on new ID.me account',
    steps: [
      ...PATH_TO_SWITCHBOARD_A,

      {
        dataToBeSent: 'Back',
        expectedReply: ACCOUNT_TYPE,
      },
    ],
  },
];
