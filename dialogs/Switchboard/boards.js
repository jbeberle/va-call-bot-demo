const { buttons } = require('../buttons');

module.exports = {
  initialQuestionsButtons: [
    buttons.InitialQuestion1,
    buttons.InitialQuestion2,
    buttons.InitialQuestion3,
    buttons.InitialQuestion4,
    buttons.InitialQuestion5,
  ],
  initialSelectorButtons: [
    buttons.DSLogon,
    buttons.MyHealtheVet,
  ],
  loginSelectorButtons: [
    buttons.yesLoginButton,
    buttons.noLoginButton,
  ],
  claimsSelectorButtons: [
    buttons.seeNextClaimButton,
    buttons.doneWithClaimsButton,
  ],
  answerQuestionButtons: [
    buttons.yesAnswerQuestionButton,
    buttons.noAnswerQuestionButton,
  ],
  thanksForLettingUsKnowButtons: [
    buttons.tryAgainButton,
    buttons.contactVaButton,
  ],
  loginButtons1: [
    buttons.verifyMyID,
    buttons.seeMoreOptions,
    buttons.backButton,
  ],
  loginButtons2: [
    buttons.noneOfThese,
    buttons.backButton,
  ],
  cancellingButtons: [
      buttons.yesCancelButton,
       buttons.noCancelButton
  ],
};
