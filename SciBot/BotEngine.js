'use strict'

var { config } = require('./config');
var { SlackApiManager } = require('./SlackApiManager');
var { ParserEngine } = require('./ParserEngine');

/**
 * Bot Engine class to handle and interact with Slack and Github Api tasks
 */
class BotEngine {
    constructor() {
        this.bot = new SlackApiManager(config.SLACK_TOKEN);
        this.parser = new ParserEngine(this.sendMessage);
    }

    // Method to start the bot
    startBot() {
        console.log("Scibot started");
        // Start the bot and pass the event handlers
        this.bot.startListening(this.messageReceived.bind(this), this.directMentions.bind(this), this.directMessage.bind(this));
    }

    /*
    [Message Handlers]
    -----------------------------------------------*/
    // handler for message received
    messageReceived(bot, message) {
        console.log(message);

        // TODO: Parse the message here

        if (message.text == 'scrum')
            bot.reply(message, "Heard '" + message.text + "' from message received");
    }

    // Handler for direct mentions (@Scibot . . . )
    directMentions(bot, message) {
        // Fetch the username
        var currentUser = this.fetchUserName(message, bot);

        var slackDetails = {
            bot: bot,
            incomingMessage: message,
            isPrivate: false
        }

        // Parse the message
        this.parser.parseInput(message.text, bot, currentUser);
    }

    // Handler for direct messages (private message to bot)
    directMessage(bot, message) {
        // Fetch the username
        var currentUser = message.user;

        var slackDetails = {
            bot: bot,
            incomingMessage: message,
            isPrivate: true
        }

        // Parse the message
        this.parser.parseInput(message.text, slackDetails, currentUser);
    }

    /*
        [Helper method for sending message] - used as a callback for database
    -----------------------------------------------*/
    sendMessage(slackDetails, outputMessage) {
        var bot = slackDetails.bot;
        var incomingMessage = slackDetails.incomingMessage;
        var isPrivate = slackDetails.isPrivate;

        if (outputMessage != null && outputMessage != undefined) {
            if (outputMessage.messageType == config.messageType.Reply) {
                bot.reply(incomingMessage, outputMessage.message);
            }
            else if (outputMessage.messageType == config.messageType.Conversation) {
                if (isPrivate)
                    bot.startPrivateConversation(incomingMessage, outputMessage.conversationCallback);
                else
                    bot.startConversation(incomingMessage, outputMessage.conversationCallback);
            }
            else if (outputMessage.messageType == config.messageType.Notification) {
                bot.say(incomingMessage, outputMessage.message);
            }
        }
        else {
            bot.reply(incomingMessage, 'An error occured!');
        }
    }
}

module.exports.BotEngine = BotEngine;