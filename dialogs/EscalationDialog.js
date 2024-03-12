// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
  ChoicePrompt,
  ListStyle,
} = require('botbuilder-dialogs');

const { DISPLAY_ANSWER } = require('./DisplayAnswer');

const { preventShowingHyperlink } = require('./Switchboard/helpers');

const ESCALATION_DIALOG = 'ESCALATION_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

class EscalationDialog extends ComponentDialog {
  constructor() {
    super(ESCALATION_DIALOG);
    // try again
    this.tryAgainButton = {
      value: 'Ask a new question', // TODO maybe rename
      synonyms: ['try again', 'ask another question', 'ask a new question'],
    };
    // contact va
    this.contactVaButton = {
      value: 'Contact VA',
      synonyms: ['contact va', 'ask an agent'],
    };
    const prompt = new ChoicePrompt(CHOICE_PROMPT);
    prompt.style = ListStyle.suggestedAction;
    this.addDialog(prompt);
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.displayPrompt.bind(this),
        this.handleButtonChoice.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  /**
   * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} turnContext
   * @param {*} accessor
   */
  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  displayPrompt(stepContext) {
    // const activity = stepContext.context.activity; // stepContext.context.activity.value.currentFlow
    // const input = activity.value || {};
    // const currentFlow = input.currentFlow;

    // Get provider from stepContext
    const { provider } = stepContext.options;
    const buttons = [this.tryAgainButton, this.contactVaButton];
    const prompt = {
      prompt: `Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question, find out how to contact VA, or find out how to contact ${preventShowingHyperlink(
        provider
      )}?`,
      retryPrompt: `Would you like to ask a new question, find out how to contact VA, or find out how to contact ${preventShowingHyperlink(
        provider
      )}?`,
      choices: buttons,
    };

    switch (provider) {
      case 'MyHealtheVet':
      case 'DS Logon':
        break; // No op, prevent default from being triggered
      default:
        // default return prompt
        prompt.prompt =
          'Thank you for letting us know. It will help us train the chatbot to answer more questions. In the meantime, would you like to ask a new question or find out how to contact VA?';
        prompt.retryPrompt =
          'Would you like to ask a new question or find out how to contact VA?';
        break;
    }
    return stepContext.prompt(CHOICE_PROMPT, prompt);
  }

  async handleButtonChoice(stepContext) {
    const choice = stepContext.result;
    // const activity = stepContext.context.activity; // stepContext.context.activity.value.currentFlow
    // const input = activity.value || {};
    // const currentFlow = input.currentFlow;
    // const currentFlowBack = currentFlow + 'Back';
    let result = '';

    // Prepare to string of user's escalation choice back to PVA/out of the skill
    switch (choice.value) {
      case this.tryAgainButton.value || this.tryAgainButton.synonyms:
        result = 'noOperation';
        await stepContext.context.sendActivity({
          type: ActivityTypes.Message,
          text: 'You can type your question in the "Type your message" section below.',
        });
        break;
      // Contact VA
      case this.contactVaButton.value || this.contactVaButton.synonyms:
        result = 'escalation';
        break;
      // Contact login provider
      case this.contactMhvButton.value || this.contactMhvButton.synonyms:
      case this.contactDSLogonButton.value ||
        this.contactDSLogonButton.synonyms: {
        // Display provider escalation QnA response
        const provider = stepContext.options.provider;
        const filter = this.generateProviderEscFilter(provider);
        await stepContext.beginDialog(DISPLAY_ANSWER, {
          filter,
        });
        result = 'endOfConversation';
        break;
      }
    }
    return await stepContext.endDialog({
      shouldEscalate: false,
      shouldExit: true,
      value: { escalationChoice: result },
    });
  }

  generateProviderEscFilter(provider) {
    let filter = '';
    switch (provider) {
      case 'Login.gov':
        filter = 'login-gov-contact';
        break;
      case 'ID.me':
        filter = 'id-me-contact';
        break;

      case 'DS Logon':
        filter = 'dslogon-contact';
        break;
      case 'MyHealtheVet':
        filter = 'mhv-contact';
        break;
    }
    return filter;
  }
}

module.exports.EscalationDialog = EscalationDialog;
module.exports.ESCALATION_DIALOG = ESCALATION_DIALOG;
