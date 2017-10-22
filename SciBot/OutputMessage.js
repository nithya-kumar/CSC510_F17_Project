'use strict'

var { config } = require('./config');

/**
 * Class OutputMessage represents the message to be used by the slackbot
 */
class OutputMessage { 
    constructor(values){
        this.message = values != null ? values.message : '';
        this.messageType = values != null ? values.messageType : config.messageType.Reply;
        this.conversationCallback = values != null ? values.conversationCallback : undefined;
    }
}

module.exports.OutputMessage = OutputMessage;