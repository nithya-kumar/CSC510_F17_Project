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

        //signoff - usecase1
        if(!resolved && this.messageForSignOff(message))
            resolved = true;
        //daily status - usecase1
        if(!resolved && this.checkDailyStatus(message))
            resolved = true;
        //daily status - usecase1
        if(!resolved && this.updateStatus(message))
            resolved = true;
		//daily status reply - usecase1
        if(!resolved && this.addUpdateStatus(message))
            resolved = true;
        //generate reports - usecase2
        if(!resolved && this.checkIfReportToBeGenerated(message))
            resolved = true;
        
        // TODO: create other rules here

        return this.output_message;
    }

    messageForSignOff(message){
      //  var obj = new RegExp('report', 'i');
        var action = new RegExp('sign in|signing in', 'i');

        if(action.test(message)){
            // Question for status

            this.output_message = 'Have you updated your daily status?';

            return true;
        }

        return false;
    }
	
	checkDailyStatus(message){
          var obj = new RegExp('yes|no', 'i');
          var action1 = new RegExp('updated|not updated', 'i');
          var action2 = new RegExp('off|absent', 'i');
  
          if(obj.test(message) && action1.test(message)){
              // Reply for status
              var yesReply = new RegExp('yes', 'i');
              this.output_message = yesReply.test(message) ? 'Okay, thank you! You may sign off.' : 'Please update your daily status.';
  
              return true;
          }
          if (obj.test(message) && action2.test(message)){
              // Reply for absence of work
              var noReply = new RegExp('no', 'i');
              this.updateStatus('absent');
              return true;
          }
  
          return false;
      }
	  
	updateStatus(message){
		var action = new RegExp('add daily status', 'i');
		var action2 = new RegExp('off|absent', 'i');
		if(action.test(message)){
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
	
	addUpdateStatus(message){
		var obj = new RegExp('daily status', 'i');
		var action1 = new RegExp('Yesterday:', 'i');
		var action2 = new RegExp('Today:', 'i');
		var action3 = new RegExp('Obstacles:', 'i');
		
		if(obj.test(message) && action1.test(message) && action2.test(message) && action3.test(message)){
			DatabaseManager.saveDailyStatus(message);
            this.output_message = 'Your daily status has been saved!';
            return true;
		} else if (action2.test(message)){
            DatabaseManager.saveDailyStatus('Yesterday:Absent' + message + 'Obstacles:Absent');
            this.output_message = 'Your daily status has been saved!';
            return true;
        }
        return false;
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

    createPingEvent(message){
      //ping user USERNAME at 1pm everyday
      //ping user USERNAME at 1pm on 1/11/17
        var obj = new RegExp('ping','i');
        var user = new RegExp('user (.*)? ','i');
        var time = new RegExp('at (.*)');

        if(obj.test(message) && user.test(message) && time.test(message))
        {
          //parse day
          var day = new RegExp('tomorrow|today|everyday');
          var date = new RegExp('on (.*)');
          if(day.test(time))
          {
            //ping user USERNAME at 1pm everyday|today|tomorrow
          }
          else if(date.test(time))
          {
            //ping user USERNAME at 1pm on 11/11/17

          }
          else
          {
            this.output_message = "Not a valid request to ping";
            return false;
          }

          return true;

        }

        return false;
        
    }

}

module.exports.ParserEngine = ParserEngine;

