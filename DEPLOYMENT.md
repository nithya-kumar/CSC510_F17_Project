# MILESONE: DEPLOYMENT

1. [Deployment Procedure](#deploy)
2. [Acceptance Test Instruction](#rules)
	* [Use Case 1](#usecase1)
	* [Use Case 2](#usecase2)
	* [Use Case 3](#usecase3)
3. [Exploratory Testing and Code Inspection](#inspect)    
4. [Task Tracking](#track)
5. [Screencast](#screencast)

## <a name="deploy"></a> Deployment Procedure

We have the following ansible playbooks: 
1. [provision.yml](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/AnsibleScripts/provision.yml) - Provisions a EC2 instance on Amazon Web Services (AWS) and generates ssh key to use as deploy key to help clone the github repo

2. [install_packages.yml](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/AnsibleScripts/install_packages.yml) - This playbook is responsible for the tasks related to setting up Scibot. This installs all the required modules and packages to run the bot, clones the github respository and runs the bot
    
3. [database.yml]() - This playbook is responsible to install and create the database that is required. 
    
## <a name="rules"></a> Acceptance Test Instructions

### 1. To initiate conversation with scibot,
	1. Log-in to slack
	2. Enter "seproject17@gmail.com" as the mail id with "SEProject2017" as the password for logging in.
	3. If you are logging in as admin please use "seprojecta17@gmail.com" as mail id with "seprojecta2017" as the password.
	3. After sucessfully logging-in navigate to "general" channel and execute the test cases given in the acceptance test plan below.


### 2. Three usecases are to be tested. 
	 
### <a name="usecase1"></a> Usecase 1: Pinging a user for daily updates

The first use case is to schedule a daily scrum and ask the users questions regarding the work done to get daily updates.

1. Either user initiates the conversation / bot reminds the user to update their daily status.
    	
	For this module, we ask initiate a conversation with the Scibot asking the user whether they have updated the daily status
	    	
	       Input:
	       @scibot Hi
	        
	```
		Expected Output:
	    	Have you updated your daily status?
	```
	
2. The user has already updated their status

	For this module, the user has already updated the daily status so scibot lets the user sign off.  
	**Note** - Key words are "yes" ; "updated"
	
	        Input:
	        @scibot yes I have updated my daily status
	
	```
		Expected Output:
	   	Okay, Thank you! You may signoff.
	```
	
3. The user has not updated their status

	For this module, the user has not updated their daily status so scibot asks the user regular scrum questions to update status  
	**Note** - Key words are "no" ; "not" ; "updated"
	
	        Input:
	        @scibot no I have not updated my daily status
	
	```
		Expected Output:
	    	Please update your daily status
		1. What did you do yesterday?
		2. What will you do today?
		3. What are the obstacles came in your way?
	```
	
4. Save the daily status of users

	For this module, once the user enters the daily status, scibot saves it into the database.  
		
	        Input:
	        @scibot 
			Yesterday: I worked on acceptance testing
			Today: I will work on setup.yml ansible playbook
			Obstacles: I was not able to clone the git repo
	
	```
		Expected Output:
	    	Your daily status has been saved!
	```
	
5. If the user was off the previous day and has not updated the daily status

	For this module, the user tells scibot they were absent the previous day, so scibot asks the user only what the user plans on doing today.  
	**Note** - Key words are "no" ; "off" ; "yesterday" ; "absent"
	
	        Input:
	        @scibot No I was off yesterday
		@scibot No I was absent yesterday
	
	```
		Expected Output:
	    	Please update your daily status
		1. What will you do today?

	```
	
6. When the user was absent the previous day.
	For this module, The user was off yesterday so the other two scrum question answers are set to absent when only this question is asked - "What will you do today?"   
			
	        Input:
	        @scibot Today: I will implement Usecase 1
	
	```
		Expected Output:
	    	Your daily status has been saved!
	```
	
7. When the user is not entering the right information according to the guidelines
	
		Input:
	        @scibot What do I have to do today?
	
	```
		Expected Output:
	    	Sorry! I didn't get that.
	```
	
### <a name="usecase2"></a> Usecase 2: Generating a summary report

The second use case is using the daily status collected from each user the bot will generate a summary report.  
The timestamps to be used should be provided in UTC timezone with the keyword 'UTC' in the message to the bot.

1. For this part in the module, the user initiates the conversation with the bot to generate a sprint report for yesterday.      	
		    	
	        Input:
	        @scibot generate sprint report for yesterday
	        
	```
		Expected Output:
		Report generated and displayed on slack in a tabular format.
	    
	```
	
2. For this part in the module, the user initiates the conversation for the bot to generate a sprint report for today.

		
	        Input:
	        @scibot generate sprint report for today
	
	```
		Expected Output:
	    	Report generated and displayed on slack in a tabular format.
	```
	
3. For this part in the module, the user initiates the conversation for the bot to generate a sprint report by giving dates.

		
	        Input:
	        @scibot generate a sprint report starting at "your date" UTC and ending "your date" UTC
	
	```
		Expected Output:
		Report generated and displayed on slack in a tabular format.
	    
	```
		
4. When the date is entered is not correct or there is no data for that date in the database
		
		Input:
	        @scibot generate a sprint report starting at "invalid date" and ending "invalid date"
	
	```
		Expected Output:
	    	Sorry report cannot be generated.
	```
		
	
5. When the user is not entering the right information according to the guidelines
	
		Input:
	        @scibot What do I have to do today?
	
	```
		Expected Output:
	    	Sorry! I didn't get that.
	```
	
### <a name="usecase3"></a> Usecase 3: Providing a manager/admin the ability to configure the setup days/times of the bot.

Another use of the bot is for the admin, i.e. the manager is to configure the bot to set up days/times of the bot's ping and summary report.
There are two kinds of team members in a team. A user can either be an admin or a normal team member. The ping and report generation configuring permissions are only provided to the admin members of the team.  
### Note: The time for the pings and report generation should be provided in UTC timezone and 'UTC' keyword should be specified in the message to the bot. 

1. The admin pings the bot with the targetted user and the configured ping time. This is received by the bot and a configured ping time is generated.  
	```
	 Input:
		Ping @nknagasi at 5pm UTC everyday for status.
	```
	```
	 Expected output:
		Your ping is generated for the user: @nknagasi in category: status
	```
2. A user gets a ping according to the configured time.  
The bot runs a scheduler that checks all upcoming pings and pings the repective user for the categories and begins the conversation.  
	```
	 Expected output  
		Hello there!
	```
	```
	 Expected input  
		hi/hey/hello
	```
3. A user who is not an admin pings the bot to configure ping time for a targetted user.  
For this module, the bot gives the reply to the user stating that the user is not authorized to configure ping timings.  
	```
	 Input  
		Ping @stiruma at 5pm UTC everyday for status.
	```
	```
	 Expected output  
		Not authorized to configure pings
	```



## <a name="inspect"></a> Exploratory Testing and Code Inspection

The implementation of all use-cases in scibot can be inspected in  
1. [BotEngine.js](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/SciBot/BotEngine.js)  
Bot Engine is the core module of the bot app server. It connects and manages the components of the app server. It helps facilitate communication among the other components of the bot. Every interaction among the app server components goes via the Bot Engine.  

2. [ParserEngine.js file](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/SciBot/ParserEngine.js)  
Parser Engine is responsible for receiving input from the users and parse it. The output of the engine is either directly store in database or used for processing in other components

3. [DatabaseManager.js](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/SciBot/DatabaseManager.js)  
Database Manager helps facilitate database connectivity for the Bot. Any CRUD operation on the database goes via this component

## <a name="track"></a>Task Tracking

WORKSHEET.md file has been updated to this milestone which can be found [here](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/WORKSHEET.md) . We have used github issues to keep track of all our tasks.

## <a name="screencast"></a>Screencast

The link to the screencast for the deployment milestone is - [here](https://youtu.be/toYmLnnhii0) .  
Explaination and testing the bot for each use cases can be referred to [here](https://goo.gl/wXkosF).
