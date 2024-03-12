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

const LOGIN_GOV_SWITCHBOARD =
  "There are a few steps you'll need to take to create a Login&period;gov account:";
const LOGIN_GOV_NEW_NONE_OF_THESE =
  'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact Login&period;gov?';
const ACCOUNT_TYPE =
  'Do you want to create a new Login&period;gov account, or do you need help with an existing account?';
const CREATE_A_NEW_ACCOUNT = 'Create a new account';
const SWITCHBOARD_A = [
  ...PREAMBLE,
  {
    dataToBeSent: 'Login.gov',
    expectedReply: ACCOUNT_TYPE,
  },
  {
    dataToBeSent: CREATE_A_NEW_ACCOUNT,
    expectedReply: LOGIN_GOV_SWITCHBOARD,
  },
];
const SWITCHBOARD_B = [
  ...PREAMBLE,
  {
    dataToBeSent: 'Login.gov',
    expectedReply: ACCOUNT_TYPE,
  },
  {
    dataToBeSent: CREATE_A_NEW_ACCOUNT,
    expectedReply: LOGIN_GOV_SWITCHBOARD,
  },
  {
    dataToBeSent: 'See more options',
    expectedReply: LOGIN_GOV_SWITCHBOARD,
  },
];
module.exports = [
  {
    testIt: 'Should have 2 switchboards for new Login.gov accounts',
    steps: [...SWITCHBOARD_B],
  },
  {
    testIt: 'Existing Login.gov switchboard b "none of these"',
    steps: [
      ...SWITCHBOARD_B,
      {
        dataToBeSent: 'None of these',
        expectedReply: LOGIN_GOV_NEW_NONE_OF_THESE,
      },
    ],
  },
  {
    testIt: 'For new Login.gov accounts click "Provide your information"',
    steps: [
      ...SWITCHBOARD_A,
      {
        dataToBeSent: 'Provide your information',
        axiosQNAExpectedPost: 'login-gov-new-content1',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For new Login.gov accounts click "Verify your identity"',
    steps: [
      ...SWITCHBOARD_A,
      {
        dataToBeSent: 'Verify your identity',
        axiosQNAExpectedPost: 'login-gov-new-content2',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For new Login.gov accounts click "Choose security options"',
    steps: [
      ...SWITCHBOARD_A,
      {
        dataToBeSent: 'Choose security options',
        axiosQNAExpectedPost: 'login-gov-new-content3',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'has a Back button for switchboard a of new Login.gov accounts',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'Login.gov',
        expectedReply: ACCOUNT_TYPE,
      },
      {
        dataToBeSent: CREATE_A_NEW_ACCOUNT,
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
      {
        dataToBeSent: 'Back',
        expectedReply: ACCOUNT_TYPE,
      },
    ],
  },
  {
    testIt: 'For new Login.gov accounts click "Login.gov Help Center"',
    steps: [
      ...SWITCHBOARD_A,
      {
        dataToBeSent: 'See more options',
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
      {
        dataToBeSent: 'Login.gov Help Center',
        axiosQNAExpectedPost: 'login-gov-help-center',
        expectedReply: 'some qna answer',
      },
    ],
  },
];
