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
    generateReport(date, slackDetails, messageCallback){
		// Create database callback
		var dbCallback = function(err, data){
			if(err){
				console.log(err);
			}
			else {
				var output_message = new OutputMessage({
					message: data.rows[0]['userid'],
					messageType: config.messageType.Reply,
					conversationCallback: undefined
				});
	
				messageCallback(slackDetails, output_message);
			}
		}

		// Build the query
		var query = 'select * from userdetails';

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
	
	saveDailyStatus(message){
		//TODO: Save into database
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
				if(category.toUpperCase() === "STATUS")
					return "\nyour ping is generated for the user :"+user+" in category: "+category;
				return "\nThe report generation is scheduled";
			}
		}
		else{
			if(category.toUpperCase() === "STATUS")
					return "\nyour ping is generated for the user :"+user+" in category: "+category;
			return "\nThe report generation is scheduled";
		}
			
		return "\n Could not process your request "
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;