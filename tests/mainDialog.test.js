const { DialogTestClient } = require('botbuilder-testing');
const { MainDialog } = require('../dialogs/MainDialog');
const describes = require('./transcripts');
const axios = require('axios');

jest.mock('axios');

describe('Main Dialog Chat Transcripts', () => {
  describes.forEach(({ describeMessage, tests, skip, only }) => {
    if (skip) {
      describe.skip(describeMessage, () => describeFns(tests)); // eslint-disable-line jest/no-disabled-tests
    } else if (only) {
      describe.only(describeMessage, () => describeFns(tests)); // eslint-disable-line jest/no-focused-tests
    } else {
      describe(describeMessage, () => describeFns(tests));
    }
  });
});

function describeFns(transcripts) {
  beforeEach(() => {
    axios.post.mockReset();
    const mockReturn = {
      data: { answers: [{ answer: 'some qna answer' }] },
    };
    axios.post.mockResolvedValueOnce(mockReturn);
  });

  transcripts
    .map((transcript) => {
      return { ...transcript, testFn: itForTranscript(transcript.steps) };
    })
    .forEach(({ testIt, testFn, skip, only }) => {
      if (only) {
        it.only(testIt, testFn); // eslint-disable-line jest/no-focused-tests
      } else if (skip) {
        it.skip(testIt, () => {}); // eslint-disable-line jest/no-disabled-tests
      } else {
        it(testIt, testFn);
      }
    });
}

function itForTranscript(steps) {
  const systemUnderTest = new MainDialog();
  const testClient = new DialogTestClient('web', systemUnderTest);
  const testFn = async () => {
    for (const conversationStep of steps) {
      const {
        dataToBeSent,
        axiosQNAExpectedPost,
        expectedReply: expectedReplyFromBot,
        expectedButtons,
        endOfConversationResult,
      } = conversationStep;
      const actual = dataToBeSent
        ? await testClient.sendActivity(dataToBeSent)
        : await testClient.getNextReply(); // this is used for consecutive responses from the bot
      checkReply(expectedReplyFromBot, actual);
      checkButtons(expectedButtons, actual);
      checkEndOfConversationResult(endOfConversationResult, actual);
      checkQnAFilter(axiosQNAExpectedPost);
    }
  };
  return testFn;

  function checkEndOfConversationResult(endOfConversationResult, actual) {
    if (endOfConversationResult) {
      expect(actual.value).toEqual(endOfConversationResult);
    }
  }
  function checkButtons(expectedButtons, actual) {
    if (expectedButtons) {
      const { actions } = actual.suggestedActions;
      const actualButtons = actions.map(({ value }) => value);
      expect(actualButtons).toEqual(expectedButtons);
    }
  }

  function checkReply(expectedReply, { text: actual }) {
    if (expectedReply) {
      expect(actual).toEqual(expectedReply);
    }
  }

  function checkQnAFilter(expectedFilter) {
    if (expectedFilter) {
      // actual is getting the QnA filter from the post request params
      const actual =
        axios.post.mock.calls[0][1].filters.metadataFilter.metadata[0].value;
      const countOfCalls = axios.post.mock.calls.length;
      expect(countOfCalls).toEqual(1);
      expect(actual).toEqual(expectedFilter);
    }
  }
}
