'use strict'

var { MockDatabase } = require('./MockDatabase');

/**
 * DatabaseManager class provides necessary methods for interaction with the database
 */
class DatabaseManager {

    generateReport(date){
        var report = MockDatabase.getSummaryReport(date);

        if(report == null || report == undefined){
            return "The report for the given sprint cannot be generated at the moment as users have not updated their work."
        }
        else {
            var message = 'User\tStatus for Previous Day\tStatus for Current Day\tBlockers\n';
            for(var i = 0; i < report.length; i++){
                message += report[i].user + "\t" + report[i].statusPrevDay + "\t" +report[i].statusCurrDay + "\t" + report[i].blockers + "\n";
            }

            message += "\nThe generated report is available at https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/DESIGN.md"

            return message;
        }
    }
	
	getScrumQuestions(flag){
        var questions = MockDatabase.getScrumQuestions();

        var message = '';

        for(var i = 0; i < questions.length; ++i){
            message += "\n" + questions[i];
        }

        return questions;
	}
	
	saveDailyStatus(message){
		//TODO: Save into database
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;