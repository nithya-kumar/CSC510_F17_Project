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
	generateReport(startDate, endDate, slackDetails, messageCallback) {
		// Create database callback
		var dbCallback = function (err, data) {
			if (err) {
				console.log(err);
			}
			else {
				var strMessage = 'Username\t\tStatus for current day\t\t\t\t\t\tStatus for previous day\t\t\t\t\t\tObstacles\t\t\t\t\t\tDate\n';
				strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';

				for (var i = 0; i < data.rows.length; ++i) {
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

		if (endDate != null) {
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date >= '" + startDate + "' and status_date <= '" + endDate + "') b inner join users a on (a.username = b.username)";
		}
		else if (startDate == 'today') {
			// Today
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date = current_date) b inner join users a on (a.username = b.username)";
		}
		else {
			// yesterday
			query = "select a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date from (select * from status where status_date = current_date - 1) b inner join users a on (a.username = b.username)";
		}

		// Fetch data from database
		DataAccess.select(query, dbCallback);
	}

	getScrumQuestions(flag) {
		var questions = MockDatabase.getScrumQuestions(flag);

		var message = '';

		for (var i = 0; i < questions.length; ++i) {
			message += "\n" + questions[i];
		}

		return message;
	}

	saveDailyStatus(message, slackDetails, messageCallback) {
		var msgArr = message.split("\n");

		//var timeOfMessage = slackDetails.incommingMessage.timestamp;
		var username = slackDetails.incomingMessage.user;

		var dbCallback = function (err, data, rowCount) {
			if (err) {
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
				if (data.rowCount == rowCount) {
					var output_message = new OutputMessage({
						message: "Your daily status has been saved!",
						messageType: config.messageType.Reply,
						conversationCallback: undefined
					});

					messageCallback(slackDetails, output_message);
				}
			}
		}

		var yes_status = msgArr[0].split(":");
		var today_status = msgArr[1].split(":");
		var obstacles = msgArr[2].split(":");
		var query = "insert into status (username, status_today, status_yesterday, status_obstacles, status_date, status_time) values('" + username + "','" + today_status[1] + "','" + yes_status[1] + "','" + obstacles[1] + "', current_date, current_time)";

		//var query = "insert into status (username, status_today, status_yesterday, status_obstacles, status_date, status_time) values('"+username+"','"+msgArr[1]+"','"+msgArr[0]+"','"+msgArr[2]+"', current_date, current_time)";
		//var query = "insert into status (username, status_today, status_yesterday, status_obstacles, status_date, status_time) values('U72KDEH60', 'sample today', 'sample yesterday', 'sample obstacle', current_date, current_time)";

		DataAccess.insert(query, dbCallback, 1);
	}


	updatePing(category, user, hrs, day, slackDetails, messageCallback) {
		var dt = dateTime.create();
		var today = new Date(dt.now());
		if (day.toUpperCase() == 'TODAY') {
			var today_datestring = '' + (today.getUTCMonth() + 1) + '/' + today.getUTCDate() + '/' + today.getUTCFullYear();
			day = today_datestring;
		}
		else if (day.toUpperCase() == 'TOMORROW') {
			today.setDate(today.getDate() + 1);
			var tomorrow_datestring = '' + (today.getUTCMonth() + 1) + '/' + today.getUTCDate() + '/' + today.getUTCFullYear();
			day = tomorrow_datestring;
		}
		var offset = today.getTimezoneOffset();
		var offset_hrs = offset/60;
		if (category.toUpperCase() === "STATUS") {
			//var query = "insert into users(username,full_name,is_admin,ping_time,ping_day) values('"+user+"','"+user+"','true','5:00:00','"+day+"')";
			hrs = parseInt(hrs)+offset_hrs;
			hrs = hrs%24;
			var hour = '' + hrs + ':00:00';
			var query = "update users set ping_time  = '" + hour + "', ping_day = '" + day.toUpperCase() + "' where username = '" + user + "' "
			var callback = function (err, res) {
				if (err) {
					console.log(err);
					return;
				}
				if(res.rowCount == 0)
				{
					var output_message = new OutputMessage({
						message: "Cannot configure ping request. User is not part of the team",
						messageType: config.messageType.Reply,
						conversationCallback: undefined
					});
					messageCallback(slackDetails, output_message);
					return;
				}
				var output_message = new OutputMessage({
					message: "Your ping is generated for the user : <@" + user + "> in category: " + category,
					messageType: config.messageType.Reply,
					conversationCallback: undefined
				});
				messageCallback(slackDetails, output_message);
			}
			DataAccess.insert(query, callback);
			return;
		}
		else if (category.toUpperCase() === "REPORT" || category.toUpperCase() === "SUMMARY") {
			var hour = '' + hrs + ':00:00';
			var query = "update team set report_time = '" + hour + "', report_day = '" + day.toUpperCase() + "' where t_id = (select t_id from users where username = '" + slackDetails.incomingMessage.user + "')";
			var callback = function (err, res) {
				if (err) {
					console.log(err);
					return;
				}
				var output_message = new OutputMessage({
					message: "Report generation time successfully configured",
					messageType: config.messageType.Reply,
					conversationCallback: undefined
				});
				messageCallback(slackDetails, output_message);
			}
			DataAccess.insert(query, callback);
			return;
		}
		var output_message = new OutputMessage({
			message: "Unable to configure your request",
			messageType: config.messageType.Reply,
			conversationCallback: undefined
		});
		messageCallback(slackDetails, output_message);
		return;
	}

	getUserDetails(callback) {
		var query = "select username, is_admin, ping_time, ping_day, t_id from users";

		DataAccess.select(query, callback);
	}

	createPing(user, day, time, text, category, slackDetails, messageCallback) {
		//console.log("Username : "+user+" day: "+day+" time: "+time+" text: "+text+" category: "+category);
		//'status|summary|report'
		var dt = dateTime.create();
		var hours = new RegExp('([0-9])', 'i');
		var meridian = new RegExp('([a-zA-Z])(.*)', 'i');
		var hrs = +hours.exec(time)[0];
		if (meridian.exec(time)[0].toUpperCase() === "PM") {
			hrs = hrs + 12;
		}
		if (day.toUpperCase() === "TODAY") {
			if (hrs > new Date(dt.now()).getHours()) {
				return this.updatePing(category, user, hrs, day, slackDetails, messageCallback);
			}
		}
		else {
			return this.updatePing(category, user, hrs, day, slackDetails, messageCallback);
		}

		var output_message = new OutputMessage({
			message: "\n Could not process your request ",
			messageType: config.messageType.Reply,
			conversationCallback: undefined
		});
		return messageCallback(slackDetails, output_message);
	}

	// Used to get the configured pings that are scheduled for the current time
	getPingsForNow(bot) {
		var dt = dateTime.create();
		var today = new Date(dt.now());
		var today_datestring = ''+(today.getUTCMonth()+1)+'/'+today.getUTCDate()+'/'+today.getUTCFullYear();
		//var query = "select * from users where ping_time = '"+new Date(dt.now()).getHours()+":00:00' and ( ping_day = 'EVERYDAY' or ping_day = '"+today_datestring+"')";
		var query = "select u.username from team t inner join users u on (t.t_id = u.t_id) where ((u.ping_day = '"+today_datestring+"' or u.ping_day = 'EVERYDAY') and u.ping_time = '" + new Date(dt.now()).getHours() + ":00:00')"
			+ " OR u.ping_day != '"+today_datestring+"' and u.ping_day != 'EVERYDAY' and t.ping_time = '" + new Date(dt.now()).getHours() + ":00:00'";
		var users = [];
		var getUsers = function (err, data) {
			if (err) {
				console.log(err);
				return;
			}
			for (var i in data.rows) {
				bot.bot.startPrivateConversation({ user: data.rows[i]['username'] }, function (err, convo) {
					if (err) {
						console.log(err);
					} else {
						convo.say("Hello there!  <@" + data.rows[i]['username'] + ">");
					}
				});
				//users.addRow(data[i]);
			}
		}
		DataAccess.select(query, getUsers);
		return users;
	}

	generateReportsForNow(bot,userDetails) {
		var dt = dateTime.create();
		var today = new Date(dt.now());
		var today_datestring = ''+(today.getUTCMonth()+1)+'/'+today.getUTCDate()+'/'+today.getUTCFullYear();

		// Create database callback
		var dbCallback = function (err, data) {
			if (err) {
				console.log(err);
			}
			else {
				var admin = null;
				var strMessage = 'Username\t\tStatus for current day\t\t\t\t\t\tStatus for previous day\t\t\t\t\t\tObstacles\t\t\t\t\t\tDate\n';
				strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';

				for (var i = 0; i < data.rows.length; ++i) {
					if (data.rows[i]['is_admin'] == '1') {
						admin = data.rows[i]['username'];
					}

					strMessage += data.rows[i]['full_name'] + '\t\t' + data.rows[i]['status_today'] + '\t\t\t\t\t\t' + data.rows[i]['status_yesterday'] + '\t\t\t\t\t\t' + data.rows[0]['status_obstacles'] + '\t\t\t\t\t\t' + data.rows[i]['status_date'] + '\n';
					strMessage += '-------------------------------------------------------------------------------------------------------------------------\n';
				}
				
				if(admin){
					bot.bot.startPrivateConversation({ user: admin }, function (err, convo) {
						if (err) {
							console.log(err);
						} else {
							convo.say(strMessage);
						}
					});
				}				
			}
		}

		var query = "select a.username, a.is_admin, a.full_name, b.status_today, b.status_yesterday, b.status_obstacles, to_char(b.status_date, 'Mon DD YYYY') as status_date"
			+ " from (select * from status where status_date = '"+ today_datestring +"') b"
			+ " inner join users a on (a.username = b.username)"
			+ " inner join team t on (t.t_id = a.t_id)"
			+ " where t.report_time = '" + new Date(dt.now()).getHours() + ":00:00' and (t.report_day = 'EVERYDAY' or t.report_day = '" + today_datestring + "')";
		// Fetch data from database
		DataAccess.select(query, dbCallback);
	}
}

var db = new DatabaseManager();

Object.freeze(db);

// Export the singleton object
module.exports.DatabaseManager = db;
