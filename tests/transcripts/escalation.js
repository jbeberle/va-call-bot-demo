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

module.exports = [
  {
    testIt: 'Should show end conversation on a "yes"',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('DS Logon', 'dslogon-contact'),
      {
        dataToBeSent: 'Yes',
        endOfConversationResult: { resolutionChoice: 'confirmedSuccess' },
      },
    ],
  },
  {
    testIt: 'Should show end conversation on a "Back"',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('DS Logon', 'dslogon-contact'),
      {
        dataToBeSent: 'Back',
        expectedReply:
          'Which login service provider do you need help with or want to learn more about?',
      },
    ],
  },
  {
    testIt: 'Should begin escalation on a "No"',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('DS Logon', 'dslogon-contact'),
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact DS Logon?',
        expectedButtons: ['Ask a new question', 'Contact VA'],
      },
    ],
  },
  {
    testIt:
      'escalation for DS Logon "ask a new question" should end conversation',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('DS Logon', 'dslogon-contact'),
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact DS Logon?',
        expectedButtons: ['Ask a new question', 'Contact VA'],
      },
      {
        dataToBeSent: 'Ask a new question',
        expectedReply:
          'You can type your question in the "Type your message" section below.',
      },
      {
        endOfConversationResult: { resolutionChoice: 'noOperation' },
      },
    ],
  },
  {
    testIt: 'escalation "contact va" should set "escalation" ',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('DS Logon', 'dslogon-contact'),
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact DS Logon?',
        expectedButtons: ['Ask a new question', 'Contact VA'],
      },
      {
        dataToBeSent: 'Contact VA',
        endOfConversationResult: { resolutionChoice: 'escalation' },
      },
    ],
  },
  {
    testIt:
      'escalation for MyHealtheVet "ask a new question" should end conversation',
    steps: [
      ...PREAMBLE,
      ...generateQnaIt('MyHealtheVet', 'mhv-contact'),
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact MyHealtheVet?',
        expectedButtons: ['Ask a new question', 'Contact VA'],
      },
      {
        dataToBeSent: 'Ask a new question',
        expectedReply:
          'You can type your question in the "Type your message" section below.',
      },
      {
        endOfConversationResult: { resolutionChoice: 'noOperation' },
      },
    ],
  },
  {
    testIt:
      'escalation for Login.gov "ask a new question" should end conversation',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'Login.gov',
        expectedReply:
          'Do you want to create a new Login&period;gov account, or do you need help with an existing account?',
      },
      {
        dataToBeSent: 'Help with my account',
        expectedReply:
          'What kind of help with Login&period;gov are you looking for today?',
      },
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact Login&period;gov?',
        expectedButtons: [
          'Ask a new question',
          'Contact VA',
          'Contact Login.gov',
        ],
      },
      {
        dataToBeSent: 'Ask a new question',
        expectedReply:
          'You can type your question in the "Type your message" section below.',
      },
      {
        endOfConversationResult: { resolutionChoice: 'noOperation' },
      },
    ],
  },
  {
    testIt: 'escalation for ID.me "ask a new question" should end conversation',
    steps: [
      ...PREAMBLE,
      {
        dataToBeSent: 'ID.me',
        expectedReply:
          'Do you want to create a new ID&period;me account, or do you need help with an existing account?',
      },
      {
        dataToBeSent: 'Help with my account',
        expectedReply:
          'What kind of help with ID&period;me are you looking for today?',
      },
      {
        dataToBeSent: 'No',
        expectedReply:
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact ID&period;me?',
        expectedButtons: ['Ask a new question', 'Contact VA', 'Contact ID.me'],
      },
      {
        dataToBeSent: 'Ask a new question',
        expectedReply:
          'You can type your question in the "Type your message" section below.',
      },
      {
        endOfConversationResult: { resolutionChoice: 'noOperation' },
      },
    ],
  },
];
