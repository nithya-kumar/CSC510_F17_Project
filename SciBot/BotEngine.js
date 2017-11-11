'use strict'

var { config } = require('./config');
var { SlackApiManager } = require('./SlackApiManager');
var { ParserEngine } = require('./ParserEngine');
var { DatabaseManager } = require('./DatabaseManager');
var CronJob = require('cron').CronJob;
var express = require('express');
var app = express();

/**
 * Bot Engine class to handle and interact with Slack and Github Api tasks
 */
class BotEngine {
    constructor() {
        this.bot = new SlackApiManager(config.SLACK_TOKEN);
        this.parser = new ParserEngine(this.sendMessage);

        this.userDetails = new Object();
    }

    // Method to start the bot
    startBot() {
        // Get all the user details
        DatabaseManager.getUserDetails(this.updateUserDetails.bind(this));

        console.log("Scibot started");
        // Start the bot and pass the event handlers
        this.bot.startListening(this.messageReceived.bind(this), this.directMentions.bind(this), this.directMessage.bind(this));

        //this.cronjob = new CronJob('* * * * * *', this.cronjobCallback.bind(this), null, true, 'America/New_York');
    }

    /*
    [Message Handlers]
    -----------------------------------------------*/
    // handler for message received
    messageReceived(bot, message) {
        if (message.text == 'scrum')
            bot.reply(message, "Heard '" + message.text + "' from message received");
    }

    // Handler for direct mentions (@Scibot . . . )
    directMentions(bot, message) {
        // Slack details object that consists of incoming message and the bot object
        var slackDetails = {
            bot: bot,
            incomingMessage: message,
            isPrivate: false
        }

        // Parse the message
        this.parser.parseInput(message.text, slackDetails);
    }

    // Handler for direct messages (private message to bot)
    directMessage(bot, message) {
        // Slack details object that consists of incoming message and the bot object
        var slackDetails = {
            bot: bot,
            incomingMessage: message,
            isPrivate: true,
            role: this.userDetails[message.user]
        }

        // Parse the message
        this.parser.parseInput(message.text, slackDetails);
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

    cronjobCallback() {
        console.log('initiating message');
        var message = { user: 'U72KDEH60', text: 'Hello there!' }
        //this.bot.bot.say(message);

        this.bot.bot.startPrivateConversation({ user: 'U72KDEH60' }, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('Hello there! Time for your daily status. <@U72KDEH60>');
            }
        });
    }

    updateUserDetails(err, data){
        for(var i in data.rows){
            var userRole = data.rows[i]['is_admin'] == '0' ? config.UserRoles.TeamMember : config.UserRoles.Admin

            this.userDetails[data.rows[i]['username']] = {
                role: userRole,
                pingTime: data.rows[i]['ping_time'],
                pingDay: data.rows[i]['ping_day']
            }

            console.log(this.userDetails[data.rows[i]['username']]);
        }

    }
}

/*var portNum = 3000;
app.listen(3000, function () {
    //console.log('Making some pancakes on port:', portNum);
});*/

/*new CronJob('0 0 * * * *', function() {
    
    //console.log('Hello puppies!')

    //var pingUsers = new ParserEngine().createPingsForNow();
    
}, null, true, 'America/New_York');*/

module.exports.BotEngine = BotEngine;