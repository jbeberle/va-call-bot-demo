/**
 *
 * @param {string} buttonToPress button click to send to the dialog
 * @param {string} expectedFilter QnA Filter to expect
 * @returns {Array} array of conversation steps
 */

module.exports = (buttonToPress, expectedFilter) => [
  {
    dataToBeSent: buttonToPress,
    axiosQNAExpectedPost: expectedFilter,
    expectedReply: 'some qna answer',
  },
  {
    expectedReply: 'Did that answer your question?',
    expectedButtons: ['Yes', 'No', 'Back'],
  },
];
