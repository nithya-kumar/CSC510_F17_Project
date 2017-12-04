# MILESONE: REPORT 

## Contents

1. [Problem solved](#problem)
2. [Primary features & screenshots](#features)
3. [Reflection on the development process and project](#about)
4. [Limitations and future work](#scope)
5. [Video presentation](#video)

## <a name="problem"></a>Problem solved

Our project the **SciBot** is a Slackbot, a lighter version of the Scrum master. It intends to assists the product owner (or Admin) and the product dev team adhere to the Scrum framework and ease their work in accomplishing the goal.

A major issue involved in this scenario can be identified as the daily management of the sprint tasks and their requirements. It also helps the admin to setup ping times for their teams and also keep track of all the tasks by genereating a summary report every sprint cycle. 

The following are the reasons why the SciBot is of help in this situation,

1. The user does not need to manually keep track of the daily sprint activities
2. SciBot can generate reminders for the user in case the user forgets to update their daily status.
3. The SciBot can specifically be helpful for the scrum master to keep track of the tasks for different team members and monitor their contributions by generating a summary report for every sprint cycle.
4. It can help the scrum master to ping the team members to ensure the completion of sprint tasks.


## <a name="features"></a>Primary Features & Screenshots

Scibot is a Slackbot where the major functionality is implemented in nodejs and all the user information is stored in a PostgreSQL database which is all hosted on AWS. Anisble playbooks were used for deployment.

### Features

Scibot has three primary features:

  1. **Pinging a user for daily updates** - It is used to schedule a daily scrum and ask the users questions regarding the work done to get daily updates.
  2. **Generating a summary report** - Here the daily status collected from each user is used by the bot to generate a summary report.
  3. **Providing a manager/admin the ability to configure the setup days/times of the bot** - Here the admin, i.e. the manager can configure the bot to set up days/times of the bot's ping and summary report.

### Screenshots

#### Feature 1

**Subflow 1**  
![Usecase 1 Subflow 1](Images/uc1_1.JPG?raw=true "Usecase 1 Subflow 1")

Explanation - User has already updated status

**Subflow 2**
![Usecase 1 Subflow 2](Images/uc1_2.JPG?raw=true "Usecase 1 Subflow 2")

Explanation - User has not updated status; Bot asks scrum questions; User replies and bot saves in DB  

**Alternate Flow**

![Usecase 1 AlternateFlow](Images/uc1_3.JPG?raw=true "Usecase 1 Alternate Flow")

Explanation - Alternate flow where user was absent the previous day; Bot asks tasks for today; User replies and bot saves in DB

#### Feature 2

**Subflow 1**  
![Usecase 2 Subflow 1](Images/uc2_1.JPG?raw=true "Usecase 2 Subflow 1")

Explanation - Generate sprint report for specific date intervals  

**Subflow 2**  
![Usecase 2 Subflow 2](Images/uc2_2.JPG?raw=true "Usecase 2 Subflow 2")

Explanation - Generate sprint report for current day  

**Alternate Flow**  
![Usecase 2 Alternate Flow](Images/uc2_3.JPG?raw=true "Usecase 2 Alternate Flow")

Explanation - Generate sprint report for specific date intervals where there is no data

#### Feature 3

**Subflow 1**  
![Usecase 2 Subflow 1](Images/uc3_1.jpg?raw=true "Usecase 3 Subflow 1")

Explanation - Generate configured pings for users by admin/manager  

**Alternate Flow**  
![Usecase 2 Alternate Flow](Images/uc3_4.jpg?raw=true "Usecase 3 Alternate Flow")

Explanation - Any user other than admin/manager is unauthorized to configure ping time  

**Subflow 2**  
![Usecase 2 Subflow 1](Images/uc3_2.jpg?raw=true "Usecase 3 Subflow 2")

Explanation - Generate configured times for report generation.  



## <a name="about"></a> Reflection on the development process and project

We started by meeting up to discuss different ideas. After finalizing that we wanted to build an agile bot to aid managers and development teams we decided on the major functionalities of our bot. Later we narrowed down the scope the usescases so that it could be implemented in the given time as the bot was initially designed to keep track of user tasks and also assign tasks to the different users as well. Once we had our usecases in place we discussed and decided the high level architecure design of the bot and the different design patterns we could follow. We decided to build a Slackbot as we also used it for our course.

We started off by implementing the bot based on the design proposal where all our usecases were tested it with mock data. We used NodeJS to implement the core logic and integrated it with Slack for UI. We used selenium tests to help us to verify our usecases. A challenge in this milestone was to mock the service and data of the bot.

After this for our next milestone we implemented our bot including the internal logic required to actually perform the services via the bot. Here we integrated our project with a database created using PostgreSQL. This was a challenge as it was difficult to connect and integrate our services together.

As the last step of our development process we developed a fully deployed version of the bot using ansible playbooks that could remotely configure a server and install the required modules and packages. We ran this playbook and are hosting it on an Amazon AWS EC2 instance. One of the problems here was to setup the environment for bot to run.

This project helped us understand the various phases that are involved in developing an application and the possible problems that may arise while developing it. Which include integrating the different phases in the development process like the different challenges mentioned above.

Building this bot overall helped us to understand how to approach a problem and critically break down the problem into different stages, focus on one stage at a time and implement it in an orderly manner. Scheduling and keeping track of the tasks and assigning different tasks helped us all to efficiently work on our project as well as manage time.


## <a name="scope"></a>Limitations and future work

**Limitations**
* Scibot does not cover all the necessary usecases of Scrum cycle  
* Github is one important CM tool in Scrum; The present version of Scibot does not have capabilities for integration with Github in order help the product dev teams

**Future work**  
* Integrate more API services like a scrum interface and other APIs to generate intelligent report  
* Extend the bot to perform functionalities based on different user, their tasks and project requirements


## <a name="video"></a>Video Presentation

The link to our video presentation can be found [here](https://youtu.be/giLOVAG2xHg)
