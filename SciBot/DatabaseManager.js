'use strict'

var dateTime = require('node-datetime');
var { MockDatabase } = require('./MockDatabaseService');

/**
 * DatabaseManager class provides necessary methods for interaction with the database
 */
class DatabaseManager {

    // Method to fetch the generated report for the given date
    generateReport(date){
        var report = MockDatabase.getSummaryReport(date);

        if(report == null || report == undefined)
            return "The report for the given sprint cannot be generated at the moment as users have not updated their work."
        else
            return "The generated report is available at " + report.filePath;
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
		console.log("Username : "+user+" day: "+day+" time: "+time+" text: "+text+" category: "+category);
		//'status|summary|report'
		var dt = dateTime.create();
		var hours = new RegExp('([0-9])','i');
		var meridian = new RegExp('([a-zA-Z])(.*)','i');
		console.log(hours.exec(time));
		console.log(meridian.exec(time));
		var hrs = +hours.exec(time)[0];
		console.log(meridian.exec(time)[0].toUpperCase());
		if(meridian.exec(time)[0].toUpperCase() === "PM" ){
			hrs = hrs + 12;
		}
		console.log("DatabaseManager dt.getTime is "+dt.getTime() + " and the date is " + new Date(dt.now()).getHours());
		console.log(hrs);
		if(hrs>new Date(dt.now()).getHours()){
			console.log("\nyour ping is generated for the user :"+user+" in category: "+category);
			return "\nyour ping is generated for the user :"+user+" in category: "+category;
		}
		return "\n Could not process your request "
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;