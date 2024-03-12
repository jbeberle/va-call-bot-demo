// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActivityTypes } = require('botbuilder');
const DEBUG_MODE_MESSAGE = 'debug';

class DialogBot extends ActivityHandler {
  /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {Dialog} dialog
   */
  constructor(conversationState, userState, dialog) {
    super();
    if (!conversationState)
      throw new Error(
        '[DialogBot]: Missing parameter. conversationState is required'
      );
    if (!userState)
      throw new Error('[DialogBot]: Missing parameter. userState is required');
    if (!dialog)
      throw new Error('[DialogBot]: Missing parameter. dialog is required');

    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty('DialogState');

    this.onMessage(async (context, next) => {
      console.log('Running dialog with Message Activity.');

      const isDebugMode = await this.handleDebugMode(context);
      if (!isDebugMode) {
        // Run the Dialog with the new message Activity.
        await this.dialog.run(context, this.dialogState);
      }

      await next();
    });
  }

  async handleDebugMode(context) {
    if (
      context.activity.type === ActivityTypes.Message &&
      context.activity.text.startsWith(DEBUG_MODE_MESSAGE)
    ) {
      await context.sendActivity('Reading the manifest file...');
      // Send back debug information
      const manifest = await this.readManifestFile();

      await context.sendActivity(
        `endpointUrl: ${manifest.endpoints[0].endpointUrl}`
      );
      return true;
    }
    return false;
  }

  readManifestFile() {
    // Read manifest json file from manifest folder without knowing the name of the file
    const fs = require('fs');
    const path = require('path');
    const manifestDir = path.join(__dirname, 'manifest');
    const manifestFile = fs
      .readdirSync(manifestDir)
      .find((file) => file.endsWith('.json'));
    return require(path.join(manifestDir, manifestFile));
  }

  /**
   * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
   */
  async run(context) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}

module.exports.DialogBot = DialogBot;
