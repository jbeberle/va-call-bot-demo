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
  'What kind of help with Login&period;gov are you looking for today?';
const LOGIN_GOV_NEW_NONE_OF_THESE =
  'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact Login&period;gov?';
const ACCOUNT_TYPE =
  'Do you want to create a new Login&period;gov account, or do you need help with an existing account?';

const STEPS_TO_SWITCHBOARD_A = [
  ...PREAMBLE,
  {
    dataToBeSent: 'Login.gov',
    expectedReply: ACCOUNT_TYPE,
  },
  {
    dataToBeSent: 'Help with my account',
    expectedReply: LOGIN_GOV_SWITCHBOARD,
  },
];

const STEPS_TO_SWITCHBOARD_B = [
  ...STEPS_TO_SWITCHBOARD_A,
  {
    dataToBeSent: 'See more options',
    expectedReply: LOGIN_GOV_SWITCHBOARD,
  },
];
module.exports = [
  {
    testIt: 'Should have 2 switchboards for existing Login.gov accounts',
    steps: [...STEPS_TO_SWITCHBOARD_B],
  },
  {
    testIt: 'For existing Login.gov accounts click "Verify my ID',
    steps: [
      ...STEPS_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Verify my ID',
        axiosQNAExpectedPost: 'login-gov-existing-content2',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For existing Login.gov accounts click "Changing my phone number',
    steps: [
      ...STEPS_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Changing my phone number',
        axiosQNAExpectedPost: 'login-gov-existing-content3',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt:
      'has a Back button for switchboard a of existing Login.gov accounts',
    steps: [
      ...STEPS_TO_SWITCHBOARD_A,
      {
        dataToBeSent: 'Back',
        expectedReply: ACCOUNT_TYPE,
      },
    ],
  },
  {
    testIt: 'For existing Login.gov accounts click "Changing my email',
    steps: [
      ...STEPS_TO_SWITCHBOARD_B,
      {
        dataToBeSent: 'Changing my email',
        axiosQNAExpectedPost: 'login-gov-existing-content4',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For existing Login.gov accounts click "Help with security options',
    steps: [
      ...STEPS_TO_SWITCHBOARD_B,
      {
        dataToBeSent: 'Help with security options',
        axiosQNAExpectedPost: 'login-gov-existing-content5',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt: 'For existing Login.gov accounts click "Login.gov Help Center',
    steps: [
      ...STEPS_TO_SWITCHBOARD_B,
      {
        dataToBeSent: 'Login.gov Help Center',
        axiosQNAExpectedPost: 'login-gov-help-center',
        expectedReply: 'some qna answer',
      },
    ],
  },
  {
    testIt:
      'Should be able to navigate back to switchboard A from B on existing Login.gov account',
    steps: [
      ...STEPS_TO_SWITCHBOARD_B,
      {
        dataToBeSent: 'Back',
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
    ],
  },
  {
    testIt: 'Existing Login.gov switchboard b "none of these"',
    steps: [
      ...STEPS_TO_SWITCHBOARD_B,
      {
        dataToBeSent: 'None of these',
        expectedReply: LOGIN_GOV_NEW_NONE_OF_THESE,
      },
    ],
  },
];
