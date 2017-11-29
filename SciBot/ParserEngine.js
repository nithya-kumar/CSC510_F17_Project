'use strict'

var { DatabaseManager } = require('./DatabaseManager');
var { MockDatabase } = require('./MockDatabaseService');
var { OutputMessage } = require('./OutputMessage');
var { config } = require('./config');

/**
 * Parser Engine for the bot
 */
class ParserEngine {
    constructor(messageCallback) {
        this.setDefaultMessage();
        this.messageCallback = messageCallback;
    }

    // Method to set the default message
    setDefaultMessage(slackDetails) {
        if ((this.output_message == null || this.output_message == undefined) && (slackDetails != null || slackDetails != undefined)){
            this.output_message = {
                message: "Sorry! I didn't get that.",
                messageType: config.messageType.Reply,
                conversationCallback: undefined
            };
        
            this.messageCallback(slackDetails, this.output_message);
        }
    }

    // Method to parse the incoming message
    parseInput(message, slackDetails) {
        this.output_message = null;
        var resolved = false;

        //signoff - usecase1
        if (!resolved && this.messageForSignOff(message, slackDetails))
            resolved = true;
        //daily status reply - usecase1
        if (!resolved && this.addUpdateStatus(message, slackDetails))
            resolved = true;
        //generate reports - usecase2
        if (!resolved && this.checkIfReportToBeGenerated(message, slackDetails))
            resolved = true;
        if (!resolved && this.createPingEvent(slackDetails, message))
            resolved = true;

        // Set default message in case of non-matching inputs
        if(!resolved)
            this.setDefaultMessage(slackDetails);

        this.output_message = null;
    }

    messageForSignOff(message, slackDetails) {
        //var action = new RegExp('sign in|signing in', 'i');
        var action = new RegExp('hi|hey|hello|sign in|signing in', 'i');

        if (action.test(message)) {
            // Question for status
            var callback = function (err, con) {
                con.addQuestion('Have you updated your daily status?', [
                    {
                        pattern: 'yes updated',
                        callback: function (response, convo) {
                            convo.say('Okay, thank you! You may sign off.');
                            convo.next();
                        }
                    },
                    {
                        pattern: 'no not updated',
                        callback: function (response, convo) {
                            var msg = DatabaseManager.getScrumQuestions('all')
                            convo.say('Please update your daily status. ' + msg);
                            convo.next();
                        }
                    },
                    {
                        pattern: 'off|absent',
                        callback: function (response, convo) {
                            var msg = DatabaseManager.getScrumQuestions('today')
                            convo.say('Please update your daily status.' + msg);
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function (response, convo) {
                            // just repeat the question
                            convo.repeat();
                            convo.next();
                        }
                    }
                ], {}, 'default');
            }

            this.output_message = new OutputMessage({
                message: '',
                messageType: config.messageType.Conversation,
                conversationCallback: callback
            });

            this.messageCallback(slackDetails, this.output_message);

            return true;
        }

        return false;
    }

    /*checkDailyStatus(message) {
        var obj = new RegExp('yes|no', 'i');
        var action1 = new RegExp('updated|not updated', 'i');
        var action2 = new RegExp('off|absent', 'i');

        if (obj.test(message) && action1.test(message)) {
            // Reply for status
            var yesReply = new RegExp('yes', 'i');
            this.output_message = yesReply.test(message) ? 'Okay, thank you! You may sign off.' : 'Please update your daily status.';

            return true;
        }
        if (obj.test(message) && action2.test(message)) {
            // Reply for absence of work
            var noReply = new RegExp('no', 'i');
            this.updateStatus('absent');
            return true;
        }

        return false;
    }*/

    updateStatus(message) {
        var action = new RegExp('add daily status', 'i');
        var action2 = new RegExp('off|absent', 'i');
        if (action.test(message)) {
            //Scrum Questions
            this.output_message = DatabaseManager.getScrumQuestions('all');
            return true;
        } else if (action2.test(message)) {
            //today alone
            this.output_message = DatabaseManager.getScrumQuestions('today');
            return true;
        }
        return false;
    }

    addUpdateStatus(message, slackDetails) {
        var action1 = new RegExp('Yesterday:', 'i');
        var action2 = new RegExp('Today:', 'i');
        var action3 = new RegExp('Obstacles:', 'i');
        var status = "";

        if (action1.test(message) && action2.test(message) && action3.test(message)) {
            DatabaseManager.saveDailyStatus(message, slackDetails, this.messageCallback);
            this.output_message = new OutputMessage({
                message: 'Your daily status has been saved!',
                messageType: config.messageType.Reply,
                conversationCallback: undefined
            });
            return true;
        } else if (!action1.test(message) && !action3.test(message) && action2.test(message)) {
            DatabaseManager.saveDailyStatus('Yesterday:Absent' + '\n' + message + '\n' + 'Obstacles:Absent', slackDetails, this.messageCallback);
            this.output_message = new OutputMessage({
                message: 'Your daily status has been saved!',
                messageType: config.messageType.Reply,
                conversationCallback: undefined
            });
            return true;
        } else if (!action1.test(message) && action3.test(message) && action2.test(message)) {
            DatabaseManager.saveDailyStatus('Yesterday:Absent' + '\n' + message, slackDetails, this.messageCallback);
            this.output_message = new OutputMessage({
                message: 'Your daily status has been saved!',
                messageType: config.messageType.Reply,
                conversationCallback: undefined
            });
            return true;
        }
        return false;
    }

    /*
        Method to generate sprint report for the given time durations
    */
    checkIfReportToBeGenerated(message, slackDetails) {
        var obj = new RegExp('report', 'i');
        var action = new RegExp('generate(d?)', 'i');
        var time = new RegExp('sprint', 'i');

        if (obj.test(message) && action.test(message) && time.test(message)) {
            var start = new RegExp('starting', 'i');
            var end = new RegExp('ending', 'i');
            var day = new RegExp('(today|yesterday)', 'i');
            var timeZone = new RegExp('UTC', 'ig');

            if (start.test(message) && end.test(message) && timeZone.test(message) && !day.test(message) && message.match(timeZone).length == 2) {
                // e.g. "Generate report for the sprint starting 11-04-2017 and ending 11-07-2017"

                // Fetch the start time
                var startIndex = message.indexOf('starting') + 9;
                var endIndex = startIndex + 11;
                var startTime = message.substring(startIndex, endIndex);

                // Fetch the end time
                startIndex = message.indexOf('ending') + 7;
                endIndex = startIndex + 11;
                var endTime = message.substring(startIndex, endIndex);

                DatabaseManager.generateReport(startTime, endTime, slackDetails, this.messageCallback);
                return true;
            }
            else if (day.test(message)) {
                // e.g. "Generate sprint report for today/yesterday"
                var index = message.indexOf('today');

                DatabaseManager.generateReport(index > -1 ? 'today' : 'yesterday', null, slackDetails, this.messageCallback);
                return true;
            }

            return false;
        }
    
        return false;
    }

    createPingEvent(slackDetails, message) {
        //ping user USERNAME at 1pm everyday
        //ping user USERNAME at 1pm on 1/11/17

        var currentUser = slackDetails.incomingMessage.user;

        var obj = new RegExp('ping|generate', 'i');
        var user = new RegExp('<@([a-zA-Z0-9]+)>', 'i');
        var summary = new RegExp('summary', 'i');
        var time = new RegExp('at (.*)', 'i');
        var timezone = new RegExp('UTC');
        if (time.test(message) && !timezone.test(message)) {
            this.output_message = new OutputMessage({
                message: "Please use UTC time zone to specify time",
                messageType: config.messageType.Reply,
                conversationCallback: undefined
            });
            this.messageCallback(slackDetails, this.output_message);
            return false;
        }

        if (obj.test(message) && (user.test(message) || summary.test(message)) && time.test(message)) {
            //var queryCheckAdmin = "Select * from users where username='"+slackDetails.user+"'";
            if (slackDetails.role != config.UserRoles.Admin) {
                this.output_message = new OutputMessage({
                    message: "Not authorised to configure pings",
                    messageType: config.messageType.Reply,
                    conversationCallback: undefined
                });
                this.messageCallback(slackDetails, this.output_message);
                return false;
            }

            /*if (MockDatabase.getUserGithubProfile(currentUser) === null) {
                this.output_message = new OutputMessage({
                    message: "Add the GitHub Id to cofigure pings",
                    messageType: config.messageType.Reply,
                    conversationCallback: undefined
                });
                return false;

            }*/

            //parse day
            var day = new RegExp('tomorrow|today|everyday', 'i');
            var date = new RegExp('on (.*)');
            var category = new RegExp('status|summary|report', 'i');
            var timePart = time.exec(message)[0];
            var timeRegex = new RegExp('at (.*?)(\\s|$)', 'i');
            var dateRegex = new RegExp('on (.*?)(\\s|$)', 'i');

            if (day.test(message)) {
                //ping user USERNAME at 1pm everyday|today|tomorrow
                var dayPart = day.exec(message)[0];
                if (category.test(message)) {
                    DatabaseManager.createPing((user.test(message) ? user.exec(message)[1] : ""), dayPart, timeRegex.exec(timePart)[1], message, category.exec(message)[0], slackDetails, this.messageCallback);
                }
                else {
                    this.output_message = new OutputMessage({
                        message: "Invalid category",
                        messageType: config.messageType.Reply,
                        conversationCallback: undefined
                    });
                    this.messageCallback(slackDetails, this.output_message);
                }
            }
            else if (date.test(message)) {
                //ping user USERNAME at 1pm on 11/11/17
                var datePart = dateRegex.exec(date.exec(message)[0])[1];
                if (category.test(message)) {
                    DatabaseManager.createPing((user.test(message) ? user.exec(message)[1] : ""), datePart, timeRegex.exec(timePart)[1], message, category.exec(message)[0], slackDetails, this.messageCallback);
                }
                else {
                    this.output_message = new OutputMessage({
                        message: "Invalid category",
                        messageType: config.messageType.Reply,
                        conversationCallback: undefined
                    });
                    this.messageCallback(slackDetails, this.output_message);
                }
            }
            else {
                this.output_message = new OutputMessage({
                    message: "Not a valid request to ping",
                    messageType: config.messageType.Reply,
                    conversationCallback: undefined
                });
                this.messageCallback(slackDetails, this.output_message);
                return false;
            }
            return true;
        }
        return false;
    }

    createPingsForNow(bot) {
        DatabaseManager.getPingsForNow(bot);
    }

    generateReportForNow(bot, userDetails) {
        DatabaseManager.generateReportsForNow(bot, userDetails);
    }
}

module.exports.ParserEngine = ParserEngine;