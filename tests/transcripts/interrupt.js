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
 *   expectedButtons: array of buttons labels in the order expected
 * }
 *******
 * each step has the following shape
 * {
 *  expectedReply: // required string for the bot's expected message
 *  dataToBeSent: // optional value, string or object, to send to the bot this would be in response to the expectedReply
 * }
 */
const ACCOUNT_TYPE =
  'Do you want to create a new Login&period;gov account, or do you need help with an existing account?';
const LOGIN_GOV_SWITCHBOARD =
  'What kind of help with Login&period;gov are you looking for today?';
const INTERRUPT_TEXT = 'Are you sure that you want to leave Sign in support?';

module.exports = [
  {
    testIt: 'interrupts the process after loading the skill',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
    ],
  },
  {
    testIt: 'navigates into the skill then interrupts',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'Login.gov',
        expectedReply: ACCOUNT_TYPE,
      },
      {
        dataToBeSent: 'Help with my account',
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
    ],
  },
  {
    testIt:
      'interrupts the process after loading the skill then selects yes and displays you can type message',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
      {
        dataToBeSent: 'Yes ',
        expectedReply:
          'You can type your question in the "Type your message" section below.',
      },
    ],
  },
  {
    testIt:
      'interrupts the process after loading the skill then selects no and goes back to account selector',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
      {
        dataToBeSent: 'No ',
        expectedReply:
          'Which login service provider do you need help with or want to learn more about?',
      },
    ],
  },
  {
    skip: true, // corner case, currently broken
    testIt:
      'interrupts the process after loading the skill then selects no and goes back to account selector tries to interrupt again',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
      {
        dataToBeSent: 'No ',
        expectedReply:
          'Which login service provider do you need help with or want to learn more about?',
      },
      {
        dataToBeSent: 'Login.gov',
        expectedReply: ACCOUNT_TYPE,
      },
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
    ],
  },
  {
    skip: true, // corner case, currently broken
    testIt:
      'goes all the way down to displaying the answer then tries to interrupt',
    steps: [
      ...PREAMBLE,

      {
        dataToBeSent: 'Login.gov',
        expectedReply: ACCOUNT_TYPE,
      },
      {
        dataToBeSent: 'Help with my account',
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
    ],
  },
  {
    skip: true, // corner case, currently broken
    testIt:
      'goes all the way down to displaying the answer, selects no then tries to interrupt',
    steps: [
      ...PREAMBLE,

      {
        dataToBeSent: 'Login.gov',
        expectedReply: ACCOUNT_TYPE,
      },
      {
        dataToBeSent: 'Help with my account',
        expectedReply: LOGIN_GOV_SWITCHBOARD,
      },
      {
        dataToBeSent: 'No',
      },
      {
        dataToBeSent: 'ewq',
        expectedReply: INTERRUPT_TEXT,
      },
    ],
  },
];
