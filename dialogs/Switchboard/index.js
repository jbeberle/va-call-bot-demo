const switchboards = require('./boards');

const imDone = "I\'m done";
const pactAct = "What\'s the Pact Act?";
const claimStatus = "What is my claim status?";
const decisionLetter = "Where is my decision letter?";
const appealUpdate = "Is there an update on my appeal?";


const {
  cancelling,
  loginSelector,
  initialSelector,
  allClaimsSelector,
  answerQuestionSelector,
    thanksForLettingUsKnowSelector,
} = require('./helpers');

const { preventShowingHyperlink } = require('./helpers');

class Switchboard {
  constructor(provider, boardName, accountType, initialQuestion) {
    this.provider = provider;
    this.boardName = boardName;
    this.accountType = accountType;
    this.initialQuestion = initialQuestion;
  }

  get prompt() {
    const { boardName, provider, accountType, initialQuestion } = this;
    const initialSelectorPrompt =
      'Which login service provider do you need help with or want to learn more about?';
    const initialQuestionsPrompt0 = 'Welcome to the VA chatbot.';
    const initialQuestionsPrompt1 =
        'This bot can help you find general information on VA.gov. To get started, try entering questions or requests like:'  +
        `\r- ${imDone}`+
        `\r- ${pactAct}`+
        `\r- ${claimStatus}` +
        `\r- ${decisionLetter}`+
        `\r- ${appealUpdate}`
    const initialQuestionsPrompt2 = "Click OK to continue";
    //const loginAsPrompt = `Do you want to create a new ${preventShowingHyperlink(
      // provider
    // )} account, or do you need help with an existing account?`;
    const loginAsPrompt = 'This requires you to be logged in.  Do you wish continue to be logged on as \'Abigail Brown\'?';
    const allClaimsAsPrompt1 = 'You have more than one in-progress compensation claim.';
    const allClaimsAsPrompt2 = 'Your first Compensation claim was filed on 05/02/2023.  This claim is currently INITIAL_REVIEW as of 04/27/2023';
    const allClaimsAsPrompt3 = 'Additional details about this and other claims can be found on Check Your claim and appeals status';
    const allClaimsAsPrompt4 = 'What would you like to do next?';
    const answerQuestionAsPrompt = 'Did that answer your question?';
    const thanksForLettingUsKnow =
      'Thank you for letting us know.  It will help us train the chatbot to answer more questions.  \
        In the meantime, would you like to try your question again or find out how to contact the VA?';
    const switchboardsPrompt = `What kind of help with ${preventShowingHyperlink(
      provider
    )} are you looking for today?`;
    const cancellingPrompt =
      'Are you sure that you want to leave Sign in support?';
    switch (true) {
      case initialSelector(boardName):
        return [initialQuestionsPrompt0, initialQuestionsPrompt1];
      case loginSelector(boardName):
        return loginAsPrompt;
      case allClaimsSelector(boardName):
        return [
          allClaimsAsPrompt1,
          allClaimsAsPrompt2,
          allClaimsAsPrompt3,
          allClaimsAsPrompt4,
        ];
      case answerQuestionSelector(boardName):
        return answerQuestionAsPrompt;
      case thanksForLettingUsKnowSelector(boardName):
        return thanksForLettingUsKnow;
      case cancelling(boardName):
        return cancellingPrompt;
    }
  }

  get buttons() {
    const { provider, boardName, accountType, initialQuestion } = this;
    switch (true) {
      case initialSelector(boardName):
        return switchboards.initialQuestionsButtons;
      // return switchboards.initialSelectorButtons;
      case loginSelector(boardName):
        return switchboards.loginSelectorButtons;
      case allClaimsSelector(boardName):
        return switchboards.claimsSelectorButtons;
      case answerQuestionSelector(boardName):
        return switchboards.answerQuestionButtons;
      case thanksForLettingUsKnowSelector(boardName):
        return switchboards.thanksForLettingUsKnowButtons;
      case cancelling(boardName):
        return switchboards.cancellingButtons;
    }
  }
}
module.exports = Switchboard;

module.exports.imDone = imDone;
module.exports.pactAct = pactAct;
module.exports.claimStatus = claimStatus;
module.exports.decisionLetter = decisionLetter;
module.exports.appealUpdate = appealUpdate;
