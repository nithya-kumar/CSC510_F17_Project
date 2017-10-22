var request = require('request');
var fs = require("fs");
//var Promise = require('bluebird');
//var parse = require('parse-link-header');
var config = require('./config');
//var run = require('make-runnable');
var https = require('https');
var querystring = require('querystring');

function createPing(messageBody, userName, time)
{
	var postData = querystring.stringify({
		user: "nknagasi",
		time: "in 1 minute",
		text: "Hi",
		token: "xoxb-258995174388-TyrBaDHWjT6YojQt4EMUvfnT"
	});
	var options = {
		url: "https://slack.com/api/reminders.add",
		method: 'POST',
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			"Content-Length": postData.length
		},
		body: postData
	};
	
	console.log(options);
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) 
	{
		console.log(response.statusCode);
		if (!error && response.statusCode == 200) {
            console.log(body);
        }
        else{
        	//console.log(response);
        	console.log(error);
        }
	});
}

createPing("","","");