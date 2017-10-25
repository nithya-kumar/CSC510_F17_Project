'use strict'

var { config } = require('./config');

class MockDatabase {

    constructor() {
        // User details
        this.userDetails = new Object();
        this.userDetails['U72KDEH60'] = { role: config.UserRoles.TeamMember, githubAccount: "achand13" };
		this.userDetails['U6WEPTUH0'] = { role: config.UserRoles.Admin, githubAccount: "stiruma" };
        // Add other user roles


        // The summary report
        this.summaryReport = new Object();
        this.summaryReport['previous'] = { filePath: "https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/SciBot/TestSprintReport.xlsx",
            reportData :[
            { user: 'User 1', statusPrevDay: 'Worked on the file download functionality', statusCurrDay: 'Still working on the file download functionality', blockers: 'None' },
            { user: 'User 2', statusPrevDay: 'absent', statusCurrDay: 'working on Payments module', blockers: 'remote machine not working' },
            { user: 'User 3', statusPrevDay: 'absent', statusCurrDay: 'absent', blockers: 'absent' }]
        };

        // Scrum questions
        this.scrumQuestions = new Object();
        this.scrumQuestions['all'] = ["1. What did you do yesterday?", "2. What will you do today?", "3. What obstacles came in your way?"];
        this.scrumQuestions['today'] = ["What will you do today?"];

        this.reminders = new Object();
    }

    getUserRole(userId){
        return this.userDetails[userId].role;
    }

    getUserGithubProfile(userId){
        return this.userDetails[userId].githubAccount;
    }

    addSummary(date, user, prev, curr, blocker){
        var obj = this.summaryReport[date];

        if(obj == null || undefined)
            this.summaryReport[date] = [];

        this.summaryReport.push({ user: user, statusPrevDay: prev, statusCurrDay: curr, blockers: blocker });

        return true;
    }

    getSummaryReport(date){
        return this.summaryReport[date];
    }

    getScrumQuestions(flag){
        return this.scrumQuestions[flag];
    }

    addReminder(name, time, message){
        this.reminders[name] = { time: time, message: message };
        return true;
    }

    checkReminder(name){
        return this.reminders[name];
    }

}

var mock = new MockDatabase();

Object.freeze(mock);

module.exports.MockDatabase = mock;