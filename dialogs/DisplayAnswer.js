const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const axios = require('axios');
// const R = require('ramda');
const {
  ChoicePrompt,
  ComponentDialog,
  WaterfallDialog,
} = require('botbuilder-dialogs');
const DISPLAY_ANSWER = 'DISPLAY_ANSWER';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
class DisplayAnswer extends ComponentDialog {
  constructor() {
    super(DISPLAY_ANSWER);
    this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.displayAnswer.bind(this),
        this.endDialog.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  // TODO: Rename function names
  async displayAnswer(stepContext) {
    const filter = stepContext.options.filter;
    const requestBody = {
      question: 'x123',
      filters: {
        metadataFilter: {
          metadata: [
            {
              key: 'filter',
              value: filter,
            },
          ],
          logicalOperation: 'AND',
        },
      },
    };
    const requestObj = this.createRequestObj(
      process.env.CQA_ENDPOINT,
      process.env.CQA_API_KEY
    );

    const getAnswer = await axios
      .post(
        `language/:query-knowledgebases?projectName=${process.env.ENV_NAME}-va-chatbot-content&deploymentName=production&api-version=2021-10-01`,
        requestBody,
        requestObj
      )
      .then((response) => response.data.answers);
    //* * RAMDA WAY */
    // const answer = R.path([0, 'answer'], getAnswer);
    //* ***native way */
    const answer = getAnswer[0].answer;
    //* ***** */
    await stepContext.context.sendActivity({ text: answer });

    // TODO: Explore usage of stepContext.next instead of ending dialog
    return await stepContext.endDialog({
      currentLocation: 'back',
      previousLocation: stepContext.options.previousLocation,
      currentProvider: stepContext.options.currentProvider,
      currentInitialQuestion: stepContext.options.currentInitialQuestion,
      currentAccountType: stepContext.options.currentAccountType,
      isCancelling: stepContext.options.isCancelling,
    });
  }

  createRequestObj(baseURL, subscriptionKey) {
    return {
      baseURL,
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    };
  }
}
module.exports.DisplayAnswer = DisplayAnswer;
module.exports.DISPLAY_ANSWER = DISPLAY_ANSWER;
