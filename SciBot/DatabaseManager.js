'use strict'

/**
 * DatabaseManager class provides necessary methods for interaction with the database
 */
class DatabaseManager {

    generateReport(date){
        if(date == 'this' || date == 'current'){
            return "The report for the current sprint cannot be generated at the moment as users have not updated their work yet."
        }
        else {
            return "The generated report is available at https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/DESIGN.md";
        }
    }
	
	getScrumQuestions(flag){
        if (flag == 'all') {
            return "\n1. What did you do yesterday?\n 2. What will you do today?\n 3. What obstacles came in your way?";
        } else {
            return "\nWhat will you do today?";
        }
	}
	
	saveDailyStatus(message){
		//TODO: Save into database
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;