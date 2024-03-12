// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const restify = require('restify');
const path = require('path');
const { BlobStorage } = require('botbuilder-azure');
// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const directline = require("offline-directline");
const express = require("express");

// Import our custom bot class that provides a turn handling function.
const { DialogBot } = require('./bot');
const { MainDialog } = require('./dialogs/MainDialog');
const qnaServiceType = 'qnAMaker';
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  ConversationState,
  createBotFrameworkAuthenticationFromConfiguration,
  // MemoryStorage,
  UserState,
} = require('botbuilder');
const {
  allowedCallersClaimsValidator,
  AuthenticationConfiguration,
  AuthenticationConstants,
} = require('botframework-connector');

const allowedCallers =
  (process.env.AllowedCallers || '').split(',').filter((val) => val) || [];

const claimsValidators = allowedCallersClaimsValidator(allowedCallers);

// If the MicrosoftAppTenantId is specified in the environment config, add the tenant as a valid JWT token issuer for Bot to Skill conversation.
// The token issuer for MSI and single tenant scenarios will be the tenant where the bot is registered.
let validTokenIssuers = [];
const { MicrosoftAppTenantId } = process.env;

if (MicrosoftAppTenantId) {
  // For SingleTenant/MSI auth, the JWT tokens will be issued from the bot's home tenant.
  // Therefore, these issuers need to be added to the list of valid token issuers for authenticating activity requests.
  validTokenIssuers = [
    `${AuthenticationConstants.ValidTokenIssuerUrlTemplateV1}${MicrosoftAppTenantId}/`,
    `${AuthenticationConstants.ValidTokenIssuerUrlTemplateV2}${MicrosoftAppTenantId}/v2.0/`,
    `${AuthenticationConstants.ValidGovernmentTokenIssuerUrlTemplateV1}${MicrosoftAppTenantId}/`,
    `${AuthenticationConstants.ValidGovernmentTokenIssuerUrlTemplateV2}${MicrosoftAppTenantId}/v2.0/`,
  ];
}

const authConfig = new AuthenticationConfiguration(
  [],
  claimsValidators,
  validTokenIssuers
);

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId,
  MicrosoftAppPassword: process.env.MicrosoftAppPassword,
  MicrosoftAppType: process.env.MicrosoftAppType,
  MicrosoftAppTenantId: process.env.MicrosoftAppTenantId,
});

const botFrameworkAuthentication =
  createBotFrameworkAuthenticationFromConfiguration(
    null,
    credentialsFactory,
    authConfig
  );

// Create the adapter. See https://aka.ms/about-bot-adapter to learn more about using information from
// the .bot file when configuring your adapter.
const adapter = new CloudAdapter(botFrameworkAuthentication);

const app = express();
directline.initializeRoutes(app, 3000, 'http://127.0.0.1:3978/api/messages');

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights. See https://aka.ms/bottelemetry for telemetry
  //       configuration instructions.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity(
    'To continue to run this bot, please fix the bot source code.'
  );
  // Clear out state
  await conversationState.delete(context);
};

// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.

// TODO switch back to this for local
// const memoryStorage = new MemoryStorage();

const myStorage = new BlobStorage({
  containerName: process.env.BlobContainerName,
  storageAccountOrConnectionString: process.env.BlobConnectionString,
});

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(myStorage);
const userState = new UserState(myStorage);

// Create the main dialog.
const dialog = new MainDialog(
  process.env.ProjectName || process.env.QnAKnowledgebaseId,
  process.env.LanguageEndpointKey || process.env.QnAEndpointKey,
  process.env.LanguageEndpointHostName || process.env.QnAEndpointHostName,
  qnaServiceType,
  process.env.DefaultAnswer,
  process.env.EnablePreciseAnswer?.toLowerCase(),
  process.env.DisplayPreciseAnswerOnly?.toLowerCase()
);
const bot = new DialogBot(conversationState, userState, dialog);

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log(`\n${server.name} listening to ${server.url}.`);
  console.log(
    '\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator'
  );
  console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Expose the manifest
server.get(
  '/manifest/*',
  restify.plugins.serveStatic({
    directory: './manifest',
    appendRequestPath: false,
  })
);

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
  // Route received a request to adapter for processing
  await adapter.process(req, res, (context) => bot.run(context));
});

function healthCheckCallback(req, res, next) {
  res.send(200, 'HealthCheckSucceeded');
  next();
}

// Health check
server.get('/api/health', healthCheckCallback);
