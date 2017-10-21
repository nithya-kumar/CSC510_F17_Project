'use strict'

var { DatabaseManager } = require('./DatabaseManager');

/**
 * Parser Engine for the bot
 */
class ParserEngine {
    constructor(){
        this.output_message = "I don't understand";
    }

    parse(message){
        var resolved = false;

        if(!resolved && this.checkIfReportToBeGenerated(message))
            resolved = true;
        
        // TODO: create other rules here

        return this.output_message;
    }

    checkIfReportToBeGenerated(message){
        var obj = new RegExp('report', 'i');
        var action = new RegExp('generate(d?)', 'i');
        var time = new RegExp('(current|this|previous) sprint', 'i');

        if(obj.test(message) && action.test(message) && time.test(message)){
            // Report to be generated
            var currentSprint = new RegExp('(current|this) sprint', 'i');

            this.output_message = currentSprint.test(message) ? DatabaseManager.generateReport('current') : DatabaseManager.generateReport('previous');

            return true;
        }

        return false;
    }
}

module.exports.ParserEngine = ParserEngine;

