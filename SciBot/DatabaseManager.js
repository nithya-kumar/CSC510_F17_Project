'use strict'

var dateTime = require('node-datetime');
var { MockDatabase } = require('./MockDatabaseService');
var { DataAccess } = require('./DataAccess');
var { OutputMessage } = require('./OutputMessage');
var { config } = require('./config');

/**
 * DatabaseManager class provides necessary methods for interaction with the database
 */
class DatabaseManager {

    // Method to fetch the generated report for the given date
    generateReport(startDate, endDate, slackDetails, messageCallback){
		// Create database callback
		var dbCallback = function(err, data){
			if(err){
				console.log(err);
			}
			else {
				var strMessage = 'Username\t\t\tStatus for current day\t\t\t\tStatus for previous day\t\t\t\tObstacles\t\t\tDate\n';
				strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';

				for(var i = 0; i < data.rows.length; ++i){
					strMessage += data.rows[i]['full_name'] + '\t\t\t' + data.rows[i]['status_today'] + '\t\t\t\t' + data.rows[i]['status_yesterday'] + '\t\t\t\t' + data.rows[0]['status_obstacles'] + '\t\t\t' + data.rows[i]['status_date'] + '\n';
					strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';
				}

				var output_message = new OutputMessage({
					message: strMessage,
					messageType: config.messageType.Reply,
					conversationCallback: undefined
				});
	
				messageCallback(slackDetails, output_message);
			}
		}

		var query = '';

		if(endDate != null){
			query = "select a.full_name, b.* from (select * from status where status_date >= '" + startDate + "' and status_date <= '" + endDate + "') b inner join users a on (a.username = b.username)";
		}
		else if(startDate == 'today'){
			// Today
			query = "select a.full_name, b.* from (select * from status where status_date = current_date) b inner join users a on (a.username = b.username)";
		}
		else{
			// yesterday
			query = "select a.full_name, b.* from (select * from status where status_date = current_date - 1) b inner join users a on (a.username = b.username)";
		}

		// Fetch data from database
		DataAccess.select(query, dbCallback);
    }
	
	getScrumQuestions(flag){
        var questions = MockDatabase.getScrumQuestions(flag);

        var message = '';

        for(var i = 0; i < questions.length; ++i){
            message += "\n" + questions[i];
        }

        return message;
	}
	
	saveDailyStatus(currentUser, message, timeOfMessage){
		var msgArr = message.split("\n");
		var query = 'insert into status (status_username, status_today, status_yesterday, status_obstacles, status_date, status_time) values(currentUser, msgArr[1], msgArr[0], msgArr[2], timeOfMessage)';
	}
	
	createPing(user,day,time,text,category){
		//console.log("Username : "+user+" day: "+day+" time: "+time+" text: "+text+" category: "+category);
		//'status|summary|report'
		var dt = dateTime.create();
		var hours = new RegExp('([0-9])','i');
		var meridian = new RegExp('([a-zA-Z])(.*)','i');
		var hrs = +hours.exec(time)[0];
		if(meridian.exec(time)[0].toUpperCase() === "PM" ){
			hrs = hrs + 12;
		}
		if(day.toUpperCase() === "TODAY"){
			if(hrs>new Date(dt.now()).getHours()){
				if(category.toUpperCase() === "STATUS"){
					var query = 'insert into users (username,ping_timestamp) values('
					return "\nyour ping is generated for the user :"+user+" in category: "+category;
				}
				return "\nThe report generation is scheduled";
			}
		}
		else{
			if(category.toUpperCase() === "STATUS"){
					return "\nyour ping is generated for the user :"+user+" in category: "+category;
			}
			return "\nThe report generation is scheduled";
		}
			
		return "\n Could not process your request "
	}
	getPingsForNow(){
		var configuredPings = null;
		var query = 'select * from users where timeStamp='+dt.now();
		configuredPings = DataAccess.select(query, callback);
		return configuredPings;
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;