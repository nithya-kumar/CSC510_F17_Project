# MILESONE: DEPLOYMENT

1. [Deployment Procedure](#deploy)
2. [Acceptance Test Instruction](#rules)
	* [Use Case 1](#usecase1)
	* [Use Case 2](#usecase2)
	* [Use Case 3](#usecase3)
3. [Code Inspection](#inspect)    
4. [Task Tracking](#track)
5. [Screencast](#screencast)

## <a name="deploy"></a> Deployment Procedure

We have the following ansible playbooks: 
1. [provision.yml](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/AnsibleScripts/provision.yml) - Provisions a EC2 instance on Amazon Web Services (AWS) and generates ssh key to use as deploy key to help clone the github repo

2. [install_packages.yml](https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/AnsibleScripts/install_packages.yml) - This playbook is responsible for the tasks related to setting up Scibot. This installs all the required modules and packages to run the bot, clones the github respository and runs the bot
    
3. [database.yml]() - This playbook is responsible to install and create the database that is required. 
    
## <a name="rules"></a> Acceptance Test Instructions

### 1. To initiate conversation with scibot,
	1. Log-in to 
	2. Enter "" as the mail-ID and use "" as the password for logging in.
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
	Screenshot:
	![1]()

2. The user has already updated their status

	For this module, the user has already updated the daily status so scibot lets the user sign off.  
	**Note** - Key words are "yes" ; "updated"
	
	        Input:
	        @scibot yes I have updated my daily status
	
	```
		Expected Output:
	   	Okay, Thank you! You may signoff.
	```
	Screenshot:
	![2]()

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
	Screenshot:
	![3]() 

4. Save the daily status of users

	For this module, once the user enters the daily status, scibot saves it into the database.  
	**Note** - There should be a space after colon but no space before as given below. 
	
	        Input:
	        @scibot 
			Yesterday: I worked on acceptance testing
			Today: I will work on setup.yml ansible playbook
			Obstacles: I was not able to clone the git repo
	
	```
		Expected Output:
	    	Your daily status has been saved!
	```
	Screenshot:
	![4]()

5. If the user was off the previous day and has not updated the daily status

	For this module, the user tells scibot they were absent the previous day, so scibot asks the user only what the user plans on doing today.  
	**Note** - Key words are "no" ; "off" ; "yesterday" ; "absent"
	
	        Input:
	        @scibot No I was off yesterday or
		@scibot No I was absent yesterday
	
	```
		Expected Output:
	    	Please update your daily status
		1. What will you do today?

	```
	Screenshot:
	![5]()

6. When the user was absent the previous day.
	For this module, The user was off yesterday so the other two scrum question answers are set to absent when only this question is asked - "What will you do today?"   
	**Note** - There should be a space after colon but no space before as given below.

		
	        Input:
	        @scibot Today: I will implement Usecase 1
	
	```
		Expected Output:
	    	Your daily status has been saved!
	```
	Screenshot:
	![6]()


7. When the user is not entering the right information according to the guidelines
	
		Input:
	        @scibot What do I have to do today?
	
	```
		Expected Output:
	    	Sorry, I don't understand that
	```
	Screenshot:
	
	![7]()

### <a name="usecase2"></a> Usecase 2: Generating a summary report

The second use case is using the daily status collected from each user the bot will generate a summary report.

1. For this part in the module, the user initiates the conversation for the bot to generate a sprint report for yesterday.      	
		    	
	        Input:
	        @scibot generate sprint report for yesterday
	        
	```
		Expected Output:
		Report generated on slack as in screenshot below
	    
	```
	Screenshot:
	![1]()

2. For this part in the module, the user initiates the conversation for the bot to generate a sprint report for today.

		
	        Input:
	        @scibot generate sprint report for today
	
	```
		Expected Output:
	    
	```
	Screenshot:
	![2]()

3. For this part in the module, the user initiates the conversation for the bot to generate a sprint report by giving dates.

		
	        Input:
	        @scibot generate a sprint report starting at "your date" and ending "your date"
	
	```
		Expected Output:
		Report generated on slack as in screenshot below
	    
	```
	Screenshot:
	![3]() 
	
4. When the date is entered is not correct or there is no data for that date in the database
		
		Input:
	        @scibot generate a sprint report starting at "invalid date" and ending "invalid date"
	
	```
		Expected Output:
	    	Sorry report cannot be generated.
	```
		
	Screenshot:
	
	![4]()

5. When the user is not entering the right information according to the guidelines
	
		Input:
	        @scibot What do I have to do today?
	
	```
		Expected Output:
	    	Sorry, I don't understand that
	```
	Screenshot:
	
	![5]()


### <a name="usecase3"></a> Usecase 3: Providing a manager/admin the ability to configure the setup days/times of the bot.

One more use of this bot is for the admin, i.e. the manager is to configure the bot to set up days/times of the bot's ping and summary report.

1. 



## <a name="inspect"></a> Code Inspection

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

The link to the screencast for the deployment milestone is - [here]() . 
Explaination and testing the bot for each use cases can be referred to [here](https://goo.gl/wXkosF).
