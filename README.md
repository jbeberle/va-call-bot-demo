## Table of Contents

- [Chatbox Demo Content](#chabtox-demo-content)
- [Quick Start](#quick-start)


# Chabox Demo Content
This project provides content for the chatbox provided for `vets-website-claims-chatbox-demo`.  
`va-virtual-agent` provides the template for this demo.  Please refer to the set of projects provided
in va-virtual-agent/skills for details on the files that are not listed here.

The file `MainDialog.js` contains the phases (aka waterfall dialog) to be executed for each conversation from the client to the bot
(DisplayOptions.js,
DisplayAnswer.js,
endOfConversationBackStep()
).
In short, this waterfall dialog will execute steps to display a set of options to the user,
display an answer to the question asked, and provide an optional step to go back if necessary.

The file `dialogs/buttons/index.js` contains all the definitions of the buttons displayed in 
the conversation by the bot.   It also contains a set of convenience queries as to if a certain
button was pressed.

The file `dialog/Switchboard/index.js` contains the various prompts that are displayed by the bot
to the user.   It also provides the groups of buttons that are to be displayed by the bot at
various phases.

The file `DisplayOptions.js` contqains the majority of the logic needed for this bot.
This file contains the logic for a ChoicePrompt provided by the Microsoft library `botbuilder-dialogs`.
A set of initial questions are displayed as possibilities for the user as a list.   

# Building and Running the Demo
## Azurite
   Azurite provides the database needed by this demo bot.   Normally, a non-demo project
would be provided by the Azure cloud environment.   However, this needs to be provided here
to store the conversation data.   Azurite can be installed using the following command:
```
npm install -g azurite
```

## offline-directline
Since Azure normally provides the communication interface (either a GET interface via polling,
or a WebSocket interface), we need to provide a mechanism to do this locally.   This is done
via the `offline-directline` product.   The downside of using this interface is that
it is only a polling implementation.  Websockets are not provided.   Therefore the client
must allow for this.  Click [here](https://github.com/ryanvolum/offline-directline) for more detail.

## Building and running

First azurite must be run: 
```
azurite --silent --location ../azurite
```
An application can be built and run using 
```
yarn install
yarn watch
```



# Debugging the App
Normally, this bot is run using the va.com web application.   However, for debugging,
the application `Bot Framework Emulator` provided by Microsoft can be used to debug
the bot.  It can be downloaded [here](https://github.com/microsoft/BotFramework-Emulator/releases)   
Once downloaded, run this application, and then launch to Bot Framework Emulator.  

# Quick-start

1. Configure`.env` for local development. See `.env-example` as a reference.
1. Run `npm install` in bot folder
1. Run `npm start` in bot folder. This will serve the bot service on a local port.
1. Open Bot Emulator and click Open Bot button
1. Set the Bot URL field as `http://localhost:{local-serve-port-from-index.js}/api/messages` and click Connect button
1. Type anything in the chat

to do: add unit tests to boilerplate