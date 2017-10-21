'use strict'

var { config } = require('./config.js');
var { SlackApiManager } = require('./SlackApiManager.js');
var { ParserEngine } = require('./ParserEngine.js');

/**
 * Bot Engine class to handle and interact with Slack and Github Api tasks
 */
class BotEngine {
    constructor() {
        this.bot = new SlackApiManager(config.SLACK_TOKEN);
        this.parser = new ParserEngine();
    }

    // Method to start the bot
    startBot() {
        console.log("Bot started");
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

        if(message.text == 'scrum')
            bot.reply(message, "Heard '" + message.text + "' from message received");
    }

    // Handler for direct mentions (@Scibot . . . )
    directMentions(bot, message) {
        // Parse the message
        var output = this.parser.parse(message.text);

        bot.reply(message, output);
    }

    // Handler for direct messages (private message to bot)
    directMessage(bot, message) {
        // Parse the message
        var output = this.parser.parse(message.text);

        bot.reply(message, output);
    }
}

module.exports.BotEngine = BotEngine;