# MILESONE: DEPLOYMENT

1. [Deployment Procedure](#deploy)
2. [Acceptance Test Instruction](#rules)
	* [USECASE 1](#usecase1)
	* [USECASE 2](#usecase2)
	* [USECASE 3](#usecase3)
3. [Exploratory Testing and Code Inspection](#inspect)    
4. [Task Tracking](#track)
5. [Screencast](#screencast)

## <a name="deploy"></a> Deployment Procedure

We have the following ansible playbooks: 

1. [Setup.yml]() - This playbook is responsible for the tasks related to setting up Scibot. This installs all the required modules and packages to run the bot. 
    
2. [database.yml]() - This playbook is responsible to install and create the database that is required. 
    
## <a name="rules"></a> Acceptance Test Instructions

### 1. To initiate and use scibot,
  1. Log-in to 
	2. Enter "" as the mail-ID and "" as the password for logging in.
	3. After sucessfully logging-in navigate to "general" channel and execute the test cases given in the acceptance test plan below.


## 2. Three usecases are to be tested. 
	 
### <a name="usecase1"></a> Usecase 1: Pinging a user for daily updates

The first use case is to schedule a daily scrum and ask the users questions regarding the work done to get daily updates.

1. Either user initiates the conversation / bot reminds the user to update their daily status.
    	
	In this particular part of testcase, we ask initiate a conversation with the Scibot asking the user whether they have updated the daily status
	    	
	        Input:
	        @scibot Hi
	        
	```
		Expected Output:
	    Have you updated your daily status?
	```
	Screenshot:
	![1]()

2. The user has already updated their status

	In this particular part of testcase, the user has already updated the daily status so scibot lets the user sign off.
	
	        Input:
	        @scibot yes I have updated my daily status
	
	```
		Expected Output:
	    Okay, Thank you! You may signoff.
	```
	Screenshot:
	![2]()

3. The user has not updated their status

	In this particular part of testcase, the user has not updated their daily status so scibot asks the user regular scrum questions to update status
	
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

	In this particular part of testcase, once the user enters the daily status, scibot saves it into the database.
	
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

	In this particular part of testcase, the user tells scibot they were absent the previous day, so scibot asks the user only what the user plans on doing today.
	
	        Input:
	        @scibot No I was off yesterday
	
	```
		Expected Output:
	    Please update your daily status
		1. What will you do today?

	```
	Screenshot:
	![5]()

6. The user was off yesterday so the other two scrum question answers are set to absent when only this question is asked - "What will you do today?" 

	In this particular part of testcase, we ask Chubot to set the Wordpress username with a particular value.
	
	        Input:
	        @scibot Today: I will implement Usecase 1
	
	```
		Expected Output:
	    Your daily status has been saved!
	```
	Screenshot:
	![6]()


#### Edge Cases

1. When the user is not entering the right information according to the guidelines
	
			Input:
	        @scibot What do I have to do today?
	
	```
		Expected Output:
	    Sorry, I don't understand that
	```
	Screenshot:
	
	![13]()

### <a name="usecase2"></a> Usecase 2: Generating a summary report

The second use case is using the daily status collected from each user the bot will generate a summary report.

**Note:** 

1. 

#### Edge Cases


### <a name="usecase3"></a> Usecase 3: Providing a manager/admin the ability to configure the setup days/times of the bot.

One more use of this bot is for the admin, i.e. the manager is to configure the bot to set up days/times of the bot's ping and summary report.

1. 

#### Edge Cases


## <a name="inscpect"></a> Exploratory Testing and Code Inspection
The implementation of all use-cases in chubot in the [bot.js file](). Code inspection can be on this file. Test cases that test for edge cases and invalid input data were part of the acceptance test plan.

## <a name="track"></a>Task Tracking
WORKSHEET.md file has been updated to this milestone which can be found [here]() . We have used github issues to keep track of all our tasks.

## <a name="screencast"></a>Screencast
The link to the screencast for the deployment milestone is - [here]() . 
Explaination and testing the bot for each use cases can be referred to [here](link to service screencast).
