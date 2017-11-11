'use strict'

var Botkit = require('botkit');
var { ApiManager } = require('./ApiManager.js');

/**
 * SlackApiManager consists of methods to connect to slack api via Botkit interface
 */
class SlackApiManager extends ApiManager {
    constructor(token) {
        super(token);
        // generate a bot controller
        this.botController = Botkit.slackbot({ debug: false });
    }

    startListening(messageReceived, directMentions, directMessage) {
        // connect the bot to a stream of messages
        this.bot = this.botController.spawn({
            token: this.token,
        });

        this.bot.startRTM();

        // Generic handler for all the messages
        this.botController.on('message_received', messageReceived);

        // Generic handler for all the direct_mention (e.g. @Scibot . . .)
        this.botController.on('direct_mention', directMentions);

        // Generic handler for all the direct_message (private message to bot)
        this.botController.on('direct_message', directMessage);
    }
}

module.exports.SlackApiManager = SlackApiManager;