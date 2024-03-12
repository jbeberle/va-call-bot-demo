// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { ActivityTypes, EndOfConversationCodes } = require('botbuilder');
const { DisplayOptions, DISPLAY_OPTIONS } = require('./DisplayOptions');
const { DisplayAnswer, DISPLAY_ANSWER } = require('./DisplayAnswer');
const { EscalationDialog, ESCALATION_DIALOG } = require('./EscalationDialog');
const { InterruptDialog } = require('./InterruptDialog');
const {
  ChoicePrompt,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} = require('botbuilder-dialogs');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const  CHOICE_PROMPT = 'CHOICE_PROMPT';

class MainDialog extends InterruptDialog {
  constructor() {
    super(MAIN_DIALOG);
    const prompt = new ChoicePrompt(CHOICE_PROMPT);
    this.addDialog(prompt);
    this.addDialog(new DisplayOptions());
    this.addDialog(new DisplayAnswer());
    this.addDialog(new EscalationDialog());
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.displayOptionsStep.bind(this),
        this.displayAnswerStep.bind(this),
        this.endOfConversationBackStep.bind(this),
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

  async displayOptionsStep(stepContext) {
    console.log('displaying displayOptionsStep');
    return await stepContext.beginDialog(DISPLAY_OPTIONS, stepContext.options);
  }

  async displayAnswerStep(stepContext) {
    // If sign in escalation, call escalate dialog
    if (stepContext.result.shouldEscalate) {
      return await stepContext.beginDialog(
        ESCALATION_DIALOG,
        stepContext.result
      );
      // If EOC, exit skill
    } else if (stepContext.result.shouldExit) {
      let output;
      // Return resolution choice to PVA
      if (
        stepContext.options.value !== undefined &&
        stepContext.options.value.escalationChoice !== undefined
      ) {
        output = stepContext.options.value.escalationChoice;
      } else {
        output = 'confirmedSuccess';
      }
      return await stepContext.context.sendActivity({
        type: ActivityTypes.EndOfConversation,
        code: EndOfConversationCodes.CompletedSuccessfully,
        value: { resolutionChoice: output },
      });
    } else if (stepContext.result.isCancelling) {
      return await stepContext.next(stepContext.result);
      // return await stepContext.context.sendActivity({
      //   type: ActivityTypes.EndOfConversation,
      //   code: EndOfConversationCodes.CompletedSuccessfully,
      //   value: { resolutionChoice: 'endOfConversation' },
      // });
    }
    if (stepContext.result.cancelled) {
      await stepContext.context.sendActivity({
        type: ActivityTypes.Message,
        text: 'You can type your question in the "Type your message" section below.',
      });
      return await stepContext.context.sendActivity({
        type: ActivityTypes.EndOfConversation,
        code: EndOfConversationCodes.CompletedSuccessfully,
        value: { resolutionChoice: 'noOperation' },
      });
    } else if (stepContext.result.notCancelled) {
      // await stepContext.context.sendActivity(
      //   'Alright, sending you back to the begining'
      //   // InputHints.ExpectingInput
      // );
      stepContext.result.notCancelled = false;
      return await stepContext.next(stepContext.result);
    }
    // If content, display the QnA answer
    return await stepContext.beginDialog(DISPLAY_ANSWER, stepContext.result);
  }

  async endOfConversationBackStep(stepContext) {
    console.log('endOfConversationBackStep: ', stepContext.result);
    return await stepContext.replaceDialog(MAIN_DIALOG, stepContext.result);
  }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;
