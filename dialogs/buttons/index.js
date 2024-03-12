const buttons = {
  verifyMyID: {
    value: 'Verify my ID',
    type: 'content',
    provider: 'Login.gov',
    filter: 'login-gov-existing-content2',
  },
  duplicateAccount: {
    value: 'Duplicate Account',
    type: 'content',
    provider: 'ID.me',
    filter: 'id-me-existing-content2',
  },
  amIEligible: {
    value: 'Am I eligible?',
    type: 'content',
    provider: 'ID.me',
    filter: 'id-me-new-content2',
  },
  seeMoreOptions: {
    value: 'See more options',
    type: 'switchboard',
  },
  noneOfThese: {
    value: 'None of these',
    type: 'escalation',
  },
  backButton: {
    value: 'Back',
    type: 'back',
  },
  InitialQuestion1: {
    value: "What's the Pact Act?",
    type: 'initial',
  },
  InitialQuestion2: {
    // value: 'Question2',
    value: 'What is my claim status?',
    type: 'initial',
  },
  InitialQuestion3: {
    value: 'Where is my decision letter?',
    type: 'initial',
  },
  InitialQuestion4: {
    value: 'Is there an update on my appeal?',
    type: 'initial',
  },
  InitialQuestion5: {
    value: 'Tell me about my prescriptions',
    type: 'initial',
  },
  MyHealtheVet: {
    value: 'MyHealtheVet',
    type: 'content',
    provider: 'MyHealtheVet',
    filter: 'mhv-contact',
  },
  DSLogon: {
    value: 'DS Logon',
    type: 'content',
    provider: 'DS Logon',
    filter: 'dslogon-contact',
  },
  yesButton: {
    value: 'Yes',
    type: 'eoc',
  },
  noButton: {
    value: 'No',
    type: 'eoc',
  },
  yesLoginButton: {
    value: 'Yes ',
    type: 'login',
  },
  noLoginButton: {
    value: 'No ',
    type: 'login',
  },
  seeNextClaimButton: {
    value: 'See Next Claim',
    type: 'claim',
  },
  doneWithClaimsButton: {
    value: "I'm Done With Claims",
    type: 'claim',
  },
  yesCancelButton: {
    value: 'Yes   ', // temporary space to address identical buttons issue. TODO: make buttons unique
    type: 'cancelling',
  },
  noCancelButton: {
    value: 'No   ', // temporary space to address identical buttons issue. TODO: make buttons unique
    type: 'cancelling',
  },
  yesAnswerQuestionButton: {
    value: 'Yes  ', // temporary space to address identical buttons issue. TODO: make buttons unique
    type: 'cancelling',
  },
  noAnswerQuestionButton: {
    value: 'No  ', // temporary space to address identical buttons issue. TODO: make buttons unique
    type: 'cancelling',
  },
  tryAgainButton: {
    value: 'Ask a new question',
  },
  contactVaButton: {
    value: 'Contact VA',
    synonyms: ['contact va', 'ask an agent'],
  },

};

function currentButtonFilter(
  currentProvider,
  currentButtonProvider,
  stepContextValue
) {
  return Object.values(buttons).find((button) => {
    const provider = currentProvider || currentButtonProvider;
    return button.provider === provider && button.value === stepContextValue;
  }).filter;
}

function findCurrentButton(buttonLabelText, provider) {
  return (
    Object.values(buttons).find(
      (button) =>
        provider &&
        button.value === buttonLabelText &&
        button.provider === provider
    ) ||
    Object.values(buttons).find((button) => button.value === buttonLabelText)
  );
}
function isInButtons(stepContextValue) {
  return Object.values(buttons).find(
    (button) => button.value === stepContextValue
  );
}

function isBackButton(stepContextValue) {
  return stepContextValue === buttons.backButton.value;
}

function isYesCancelButton(stepContextValue) {
  console.log('yesCancelButton: ', stepContextValue);
  return stepContextValue === buttons.yesCancelButton.value;
}
function isNoCancelButton(stepContextValue) {
  return stepContextValue === buttons.noCancelButton.value;
}


function isNoButton(stepContextValue) {
  return stepContextValue === buttons.noButton.value;
}

function isYesButton(stepContextValue) {
  return stepContextValue === buttons.yesButton.value;
}

function isYesLoginButton(stepContextValue) {
  console.log('yesLoginButton: ', stepContextValue);
  return stepContextValue === buttons.yesLoginButton.value;
}

function isNoLoginButton(stepContextValue) {
  return stepContextValue === buttons.noLoginButton.value;
}

function isNoneOfThese(stepContextValue) {
  return stepContextValue === buttons.noneOfThese.value;
}

function isSeeNextClaimButton(stepContextValue)
{
  return stepContextValue === buttons.seeNextClaimButton.value;
}

function isContactVaButton(stepContextValue)
{
  return stepContextValue === buttons.contactVaButton.value;
}

function isDoneWithClaimsButton(stepContextValue) {
  return stepContextValue === buttons.doneWithClaimsButton.value;
}

function isClaimsButton(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion2.value;
}

function isPactQuestionButton(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion1.value;
}

function isDecisionLetterButton(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion3.value;
}

function isAppealButton(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion4.value;
}

function isPrescriptionButton(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion5.value;
}

function isYesAnswerQuestionButton(stepContextValue)
{
  return stepContextValue === buttons.yesAnswerQuestionButton.value;
}

function isNoAnswerQuestionButton(stepContextValue) {
  return stepContextValue === buttons.noAnswerQuestionButton.value;
}


function isInitialQuestion1Button(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion1.value;
}

function isInitialQuestion2Button(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion2.value;
}

function isInitialQuestion3Button(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion3.value;
}

function isInitialQuestion4Button(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion4.value;
}

function isInitialQuestion5Button(stepContextValue) {
  return stepContextValue === buttons.InitialQuestion5.value;
}

module.exports = {
  buttons,
  currentButtonFilter,
  findCurrentButton,
  isBackButton,
  isNoneOfThese,
  isNoButton,
  isYesButton,
  isInButtons,
  isYesCancelButton,
  isNoCancelButton,
  isYesLoginButton,
  isNoLoginButton,
  isDoneWithClaimsButton,
  isSeeNextClaimButton,
  isYesAnswerQuestionButton,
  isNoAnswerQuestionButton,
  isContactVaButton,
  isPrescriptionButton,
  isAppealButton,
  isDecisionLetterButton,
  isPactQuestionButton,
  isClaimsButton,
};
