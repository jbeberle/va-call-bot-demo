// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// const { InputHints } = require('botbuilder');
const { isInButtons } = require('./buttons');
const { ComponentDialog } = require('botbuilder-dialogs');

/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
class InterruptDialog extends ComponentDialog {
  async onContinueDialog(innerDc) {
    const result = await this.interrupt(innerDc);
    if (result) {
      return result;
    }
    return await super.onContinueDialog(innerDc);
  }

  async interrupt(innerDc) {
    if (innerDc.context.activity.text) {
      const text = innerDc.context.activity.text;
      console.log('interrupt text: ', text);
      if (!isInButtons(text)) {
        console.log("NOT Found text in button list")
        // TODO: leverage the sendActivity code below for more robust interrupt
        // await innerDc.context.sendActivity(InputHints.IgnoringInput);
        return await innerDc.endDialog({
          // shouldExit: true,
          // shouldEscalate: true,
          currentLocation: 'cancelling',
          isCancelling: true,
        });
      }
    }
  }
}

module.exports.InterruptDialog = InterruptDialog;
