// const R = require('ramda');

const {
  ChoicePrompt,
  ComponentDialog,
  WaterfallDialog,
  ListStyle,
} = require('botbuilder-dialogs');

const DISPLAY_OPTIONS = 'DISPLAY_OPTIONS';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const Switchboard = require('./Switchboard');
const {
  currentButtonFilter,
  findCurrentButton,
  isBackButton,
  isNoneOfThese,
  isNoButton,
  isYesButton,
  isYesCancelButton,
  isNoCancelButton,
  isNoLoginButton,
  isDoneWithClaimsButton,
    isYesAnswerQuestionButton,
    isNoAnswerQuestionButton,
  isSeeNextClaimButton,
  isContactVaButton,
  isClaimsButton,
  isPrescriptionButton,
  isAppealButton,
  isDecisionLetterButton,
  isPactQuestionButton,
} = require('./buttons');
const {MessageFactory} = require("botbuilder");
const {testPost, testGet, testGetUser} = require("../communication/api");

class DisplayOptions extends ComponentDialog {
  constructor() {
    super(DISPLAY_OPTIONS);
    const prompt = new ChoicePrompt(CHOICE_PROMPT);
    prompt.style = ListStyle.suggestedAction;

    this.addDialog(prompt);
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.displayOptions.bind(this),
        this.navigateToNextLocation.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async displayOptions(stepContext) {
    const isCancelling = stepContext.options.isCancelling;
    const currentSwitchBoard =
      stepContext.options.currentLocation || 'initialSelector';
    if (
      stepContext.options.currentLocation === 'initialSelector' &&
      stepContext.options.choices === 'Back'
    ) {
      stepContext.options.provider = '';
      stepContext.options.currentProvider = '';
      stepContext.options.currentInitialQuestion = '';
    }

    const currentProvider = stepContext.options.currentProvider || '';
    const currentInitialQuestion = stepContext.options.currentInitialQuestion || '';
    const currentAccountType = stepContext.options.currentAccountType || '';
    // const currentProvider =
    //   stepContext.options.currentProvider ||
    //   (await this.newCurrentProviderProperty.get(stepContext.context, ''));
    const switchboard = new Switchboard(
      currentProvider,
      currentSwitchBoard,
      currentAccountType,
      currentInitialQuestion,
    );

    if (isCancelling) {
      return stepContext.prompt(CHOICE_PROMPT, {
        prompt: switchboard.prompt,
        choices: switchboard.buttons,
      });
    }

    if (stepContext.options.shouldExit) {
      return await stepContext.endDialog({ shouldExit: true });
    }

    if(Array.isArray(switchboard.prompt)) {
      for(var i=0; i<switchboard.prompt.length - 1; i++ ) {
        await stepContext.context.sendActivity(switchboard.prompt[i]);
      }


      return stepContext.prompt(CHOICE_PROMPT, {
        prompt: switchboard.prompt[switchboard.prompt.length - 1],
        choices: switchboard.buttons,
        style: switchboard.buttons.length > 2 ? ListStyle.none : ListStyle.suggestedAction,
      });
    } else {
      return stepContext.prompt(CHOICE_PROMPT, {
        prompt: switchboard.prompt,
        choices: switchboard.buttons,
        style: switchboard.buttons.length > 2 ? ListStyle.none : ListStyle.suggestedAction,
      });
    }
  }

  async navigateToNextLocation(stepContext) {

    let currentProvider = stepContext.options.currentProvider || '';
    let currentInitialQuestion = stepContext.options.currentInitialQuestion || '';

    const currentButton = findCurrentButton(
      stepContext.result.value,
      currentProvider
    );

    let currentSwitchBoard =
      stepContext.options.currentLocation || 'initialSelector';
    let currentAccountType = stepContext.options.currentAccountType || '';
    const { value: currentButtonText, type: currentType } = currentButton;

    // navigate to next screen
    // Switch to change value of next location
    if (currentType === 'provider') {
      currentProvider = currentButtonText;
    }
    else if (currentType === 'initial') {
      currentInitialQuestion = currentButtonText;
    }

    const mapCurrentToNextLocation = {
      initialSelector: 'loginSelector',
      loginSelector: 'allClaimsSelector',
      allClaimsSelector: 'answerQuestionSelector',
      answerQuestionSelector: 'thanksForLettingUsKnowSelector',
      thanksForLettingUsKnowSelector: 'switchboardC',
    };

    const mapCurrentToPreviousLocation = {
      initialSelector: '',
      loginSelector: 'initialSelector',
      allClaimsSelector: 'loginSelector',
      answerQuestionSelector: 'allClaimsSelector',
      thanksForLettingUsKnowSelector: 'answerQuestionSelector',
      switchboardC: 'thanksForLettingUsKnowSelector',
    };

    let nextLocation = '';
    let previousLocation = '';

    if (isBackButton(stepContext.result.value)) {
      previousLocation = mapCurrentToPreviousLocation[currentSwitchBoard];

      stepContext.options.currentProvider = currentProvider;
      stepContext.options.currentInitialQuestion = currentInitialQuestion;
      stepContext.options.currentLocation = previousLocation;
      stepContext.options.choices = stepContext.result.value;
      stepContext.options.currentAccountType = currentAccountType;

      return await stepContext.replaceDialog(
        DISPLAY_OPTIONS,
        stepContext.options
      );
    }
    stepContext.options.shouldEscalate = true;
    stepContext.options.shouldExit = false;
    stepContext.options.provider = currentProvider;
    stepContext.options.currentInitialQuestion = currentInitialQuestion;
    console.log(`current initial question = ${currentInitialQuestion}`)

    if (
      isNoneOfThese(stepContext.result.value) ||
      isNoButton(stepContext.result.value) ||
        isNoLoginButton(stepContext.result.value)
    ) {
      return await stepContext.endDialog(stepContext.options);
    }
    if (isYesButton(stepContext.result.value)) {
      // exit dialog and go to EOC
      return await stepContext.endDialog({ shouldExit: true });
    }
    if (isNoLoginButton(stepContext.result.value)) {
      // exit dialog and cancel
      return await stepContext.endDialog({ shouldExit: true });
    }
    if (isSeeNextClaimButton(stepContext.result.value)) {
      return await stepContext.endDialog({ shouldExit: true });
    }
    if (isYesCancelButton(stepContext.result.value)) {
      // exit dialog and cancel
      return await stepContext.endDialog({ cancelled: true });
    }
    if (isNoCancelButton(stepContext.result.value)) {
      // exit dialog and got back to the top of displayOptions
      return await stepContext.endDialog({ notCancelled: true });
    }
    if (isContactVaButton(stepContext.result.value)) {
      await stepContext.context.sendActivity('Thank you for contacting the VA.  Sending data to call center...');
      // const x = await testGet('600246732').then(j => j.attributes);
      const x = await testGet('600246732').then(j => j);
      const claimId = x.id;
      const claimType = x.attributes.claimType;
      const claimPhase = x.attributes.phase;
      console.log('Got claim');	     
      console.log(x);
      const u = await testGetUser().then(j => j);
      console.log(u);
      testPost(u.first_name + " " + u.last_name, u.email, 'United States Coast Guard', 'IDME', stepContext.options.currentInitialQuestion, claimId, claimType, claimPhase);
      await stepContext.context.sendActivity('Please call the VA support line at 1-800-827-1000.')
      return await stepContext.endDialog({ cancelled: true });
    }
    console.log("Before checking claims button")
    if(!isClaimsButton(stepContext.result.value)) {
      console.log("Before checking other buttons")
      if(  isPrescriptionButton(stepContext.result.value) || isAppealButton(stepContext.result.value) ||
          isDecisionLetterButton(stepContext.result.value) || isPactQuestionButton(stepContext.result.value)) {
            // Skip the next two questions
            currentSwitchBoard = mapCurrentToNextLocation[currentSwitchBoard];
            currentSwitchBoard = mapCurrentToNextLocation[currentSwitchBoard];
      }
    }
    console.log("After checking claims button")

    if (currentType === 'content') {

      // *****************************
      // Native way
      const filter = currentButtonFilter(
        currentProvider,
        currentButton.provider,
        stepContext.result.value
      );
      // end Native way *****************
      nextLocation = currentButtonText;

      return await stepContext.endDialog({
        currentProvider: currentButton.provider,
        previousLocation: currentSwitchBoard,
        filter,
        currentAccountType,
        isCancelling: stepContext.options.isCancelling,
      });
    } else {
      // If continue navigating
      nextLocation = mapCurrentToNextLocation[currentSwitchBoard];
      console.log(`next location = ${nextLocation}`)
    }

    // keep current type as is
    // this.currentAccountType = stepContext.options.currentAccountType;

    stepContext.options.currentAccountType = currentAccountType;
    stepContext.options.currentProvider = currentProvider;
    stepContext.options.currentInitialQuestion = currentInitialQuestion;
    stepContext.options.currentLocation = nextLocation;
    stepContext.options.choices = stepContext.result.value;
    stepContext.options.contentType = currentType;

    return await stepContext.replaceDialog(
      DISPLAY_OPTIONS,
      stepContext.options
    );
  }
}

module.exports = { DisplayOptions, DISPLAY_OPTIONS };
