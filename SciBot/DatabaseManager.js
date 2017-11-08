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
				var strMessage = 'Username\t\tStatus for current day\t\t\t\t\t\tStatus for previous day\t\t\t\t\t\tObstacles\t\t\t\t\t\tDate\n';
				strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';

				for(var i = 0; i < data.rows.length; ++i){
					strMessage += data.rows[i]['full_name'] + '\t\t' + data.rows[i]['status_today'] + '\t\t\t\t\t\t' + data.rows[i]['status_yesterday'] + '\t\t\t\t\t\t' + data.rows[0]['status_obstacles'] + '\t\t\t\t\t\t' + data.rows[i]['status_date'] + '\n';
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
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date >= '" + startDate + "' and status_date <= '" + endDate + "') b inner join users a on (a.username = b.username)";
		}
		else if(startDate == 'today'){
			// Today
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date = current_date) b inner join users a on (a.username = b.username)";
		}
		else{
			// yesterday
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date = current_date - 1) b inner join users a on (a.username = b.username)";
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
	
	saveDailyStatus(message, slackDetails, messageCallback){
		var msgArr = message.split("\n");

		//var timeOfMessage = slackDetails.incommingMessage.timestamp;
		var username = slackDetails.incomingMessage.user;

		var dbCallback = function(err, data, rowCount){
			if(err){
				console.log(err);
				var output_message = new OutputMessage({
					message: "I'm unable to save your daily status!",
					messageType: config.messageType.Reply,
					conversationCallback: undefined
				});
	
				messageCallback(slackDetails, output_message);
			}
			else {
				// Match the rowcount
				if(data.rowCount == rowCount){
					var output_message = new OutputMessage({
						message: "Your daily status has been saved!",
						messageType: config.messageType.Reply,
						conversationCallback: undefined
					});
		
					messageCallback(slackDetails, output_message);
				}
				else {

				}
			}
		}

		//var query = "insert into status (username, status_today, status_yesterday, status_obstacles, status_date, status_time) values(" + username + ", msgArr[1], msgArr[0], msgArr[2], timeOfMessage)";
		var query = "insert into status (username, status_today, status_yesterday, status_obstacles, status_date, status_time) values('Anshul', 'sample today', 'sample yesterday', 'sample obstacle', current_date, current_time)";

		DataAccess.insert(query, dbCallback, 1);
	}
	
	
	insertPing(category,user,hrs,day){
		if(category.toUpperCase() === "STATUS"){
			var query = 'insert into users (username,ping_time,ping_day) values('+user+','+hrs+','+day+')';
			var callback = function(err,res){
				if(err){
					console.log(err);
					return;
				}
			}
			DataAccess.insert(query,callback);
			return "\nyour ping is generated for the user :"+user+" in category: "+category;
		}
		return "\nThe report generation is scheduled";
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
				return this.insertPing(category,user,hrs,day);
			}
		}
		else{
			return this.insertPing(category,user,hrs,day);
		}
			
		return "\n Could not process your request ";
	}
	// Used to get the configured pings that are scheduled for the current time
	getPingsForNow(messageCallback){
		var dt = dateTime.create();
		var query = 'select * from users where timeStamp='+dt.now();
		var users = [];
		var getUsers = function(err, data){
			if (err) {
				console.log(err);
				return;
			}
			for (var i in rows) {
				console.log(rows[i]);
				users.addRow(rows[i]);
			}
		}
		DataAccess.select(query, getUsers);
		return users;
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;