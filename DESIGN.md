# Design Milestone

## Problem Statement
Agile Scrum is an iterative and incremental framework for managing software product development. There are three core roles in the Scrum process viz, the product owner, the development team and the Scrum master. Each of the roles have sophisticated task lists which they need to manage and work upon. The role of a Scrum master is unique in the Scrum process. The Scrum master is accountable for removing impediments to the ability of the team to deliver the product goals and deliverables. Having a trustworthy and self-sufficient Scrum master is a big challenge (problem). For our project, the **SciBot** we are planning to implement a lighter version of the Scrum master which is intended to assist the product owner (or Admin) and the product dev team adhere to the Scrum framework and ease their work in accomplishing the goal.

## Bot Description  
The **SciBot** is an easy to use bot that helps the user keep track of the sprint activities.
The scrum agile methodology is a well-known methodology for the Software Development Lifecycle Management. Sprint being the core of the scrum holds an important role in the development of a product. As a part of scrum, teams collaborate to list down the project requirements. Scrum is further divided into sprint cycles that monitor the flow of development. Daily sprint activities help the teams to meet the project targets and deadlines within time period and gives abilities to perform better.  

A major issue involved in this scenario can be identified as the daily management of the sprint tasks and their requirements. A SciBot user needs an automated manager to help the user monitor these activities and assist in the daily tasks that do not need any supervision of the user and might take up a lot of the user’s time.  

The following are the reasons why the SciBot is of help in this situation,
* The user does not need to manually keep track of the daily sprint activities.
* The user can choose to automate the process of pushing the daily code, documentation or any other new files generated without the need to manually do these activities that do not usually require any supervision.
* The SciBot can generate reminders for the user in case the user forgets the tasks or does not push them.
* The SciBot can specifically be helpful for the scrum master to keep track of the tasks for different team members and monitor their contributions according to the requirements specified in the file given by the user.  

The SciBot belongs to the category of Responders. It keeps track of the tasks to be performed and generates reminders for the tasks as the deadline approaches. It can differentiate between different users and identify their tasks independently. It maintains a memory to store all the data related to the user, tasks, deadlines and any other specific requirements of the scrum master.

### Use Cases
```
USECASE 1: Collect daily tasks and keep track of commits

The first use case is for sending reminders to the users i.e. team members to commit at the end of the day and if the user does not commit then shows the time overdue.
1 Preconditions
  User must have a GitHub account to push all the work done on a daily basis.
  User must have a slack account and be member of the team they are working with.
2 Main Flow
  The user will inform the bot that they are done for the day [S1], then the bot will notify and remind the user that it is time to commit the work done [S2]. Also, it shows users overdue tasks with time if they have not committed previously [S3], to prevent users from slacking in their work.
3 Sub Flow
  [S1] The user will inform the bot that they are done for the day
  [S2] The bot will remind the user that it is time to commit the work done
  [S3] The bot shows them tasks overdue with time
4 Alternative Flows
  [E1] No team members available
  [E2] The user is not at work for that day
```
```
USECASE 2: Creation and assignment of tasks

The second use case is for the admin i.e. the team lead to create and assign tasks to the different team members. The admin will be responsible for deciding and uploading the concrete deliverables for each sprint cycle as well as deciding the sprint time.
1 Preconditions
  The admin is the only person who can directly assign and configure the bot
  The admin should have a GitHub and slack account as well
2 Main Flow
  Instead of the admin sending out separate emails to each person with their tasks, they will just need to upload the task assignment to the bot [S1] and the bot will take care of notifying the team members of their tasks [S2]. The different tasks will be assigned to the team members according to what the admin has sent to the bot.
3 Sub Flows
  [S1] The admin will upload a file with the team members and their respective tasks
  [S2] The bot then notifies the team members of the tasks they have been assigned
4 Alternative Flows
  [E1] No tasks need to be assigned
  [E2] One or more team members don't have any tasks assigned to them
```
```
USECASE 3: Notifications of the tasks due 

One more use of this bot is to collect daily tasks and activities of the users i.e. the team members. It is used notifying the users who are working on the project with the tasks due and provide a list of tasks due with priority.
1 Preconditions
  User must have a GitHub account to push all the work done on a daily basis.
  The user must also have a slack account and be member of the team he is working with.
2 Main Flow
  The user will log into the system in the morning and then ask the bot what are the tasks for today [S1] to help keep track of what should be done. The bot having saved all the previous activities will provide a list of tasks that should be dealt with immediately which are of utmost importance [S2] and then the other tasks after.
3 Sub Flows
  [S1] The user asks the bot what are the tasks for today
  [S2] The bot replies with a list of tasks with priority according to which one should be dealt with first
4 Alternative Flows
  [E1] All the tasks have already been completed before hand
  [E2] Too many tasks are remaining and the user cannot complete everything
```
```
USECASE 4: Daily Scrum Update
1 Preconditions
  User must have a GitHub account to push all the work done on a daily basis.
  The user must also have a slack account and be member of the team he is working with.
2 Main Flow
  The user logs on to Slack [S1].  The bot like a scrum master conducts a daily meeting [S2] where it asks the user what they did yesterday, what they plan to do today and if they faced any obstacles. The user replies to the bot with the answers[S3]
3 Sub Flows
  [S1] The user logs on to Slack
  [S2] The bot like a scrum master conducts a daily meeting.
  [S3] The user replies to the bot with the answers
 4 Alternative Flows
  [E1] The user does not log into slack

### Design Sketches

#### Wireframe  
The following mockups bring out our bot idea and let you check SciBot in action. Additionally, you can access its prototype [here](https://app.walkiebot.co/anon/2n90g-5htfz/story/daily-scrum-meeting "View prototype").

* SciBot as a Scrum Master for daily status updates
![Standup](Mockup/Standup.png?raw=true "Standup")

* Assisting the Dev Team with tasks
![DevAssistant](Mockup/DevAssistant.png?raw=true "DevAssistant")

* Keeping track of the timlines
![Notify](Mockup/Notify.png?raw=true "Notify")

* Interaction with Admin for configurations
![Configure](Mockup/Configure.png?raw=true "Configure")

#### Storyboard



## Architecture Design

**SciBot** is a slack bot that assists implementation of the Agile **Scrum** method. The architectural pattern of the bot could be a **hybrid of the repository and event triggered patterns.**
It is a repository model because all the work done by the teams is stored on GitHub. But since it also gives notifications when users login and talk to the bot, it is also event triggered.

### High-level architecture of SciBot  

![High-level Architecture](ArchitectureDiagram/MainArchi.jpg?raw=true "High-level Architecture")  

### Architecture components  
The basic components of SciBot architecture are:

#### 1. The Slack User Interface  
The Slack UI is used by the users for interaction with bot

#### 2. SciBot App Server  
The bot server has the following components  
  **Bot Engine** – Bot Engine is the core module of the bot app server. It connects and manages the components of the app server. It helps facilitate communication among the other components of the bot. Every interaction among the app server components goes via the Bot Engine  
  **Slack API Manager** – Slack API Manager helps SciBot and users to communicate effectively. It is used to send and receive data between the Bot App server and users  
  **Parser Engine** – Parser Engine is responsible for receiving input from the users and parse it. The output of the engine is either directly store in database or used for processing in other components  
  **Event Manager** – Event Manager is responsible for managing the notifications that are to be provided by the bot to the user. It interacts with Time APIs (timezonedb) to display appropritate time reminders to the users  
  **Git API Manager** – Git API Manager is responsible to connect GitHub with the bot. It interacts with GitHub via Rest APIs to accomplish Git tasks required in the Scrum  
  **Database Manager** – Database Manager helps facilitate database connectivity for the Bot. Any CRUD operation on the database goes via this component  
  **Slack API Manager** – The Slack API Manager helps SciBot and users to communicate effectively. It is used to send and receive data between the Bot App server and users

#### 3. SQL Database  
All the user, admin, tasks, project and bot processed information is stored in SQL database.

### Constraints
The following constraints can be observed in the Scibot:  
* It will establish entitlements for different users and thus defining the permissions for all the users to do various tasks. Example: The Admin will have the functionality to create and assign tasks to different team members. The team members cannot create tasks thus limiting their entitlements.  
* SciBot can only interact with one user at a time. Thus it can take input from one user at a specific instant. 
* SciBot makes API calls to GitHub and Slack. It relies on GitHub and Slack API being statically incorporated into the functions. If any changes are made to the GitHub and Slack API, they will be needed to be manually updated in the bot.   
* The SciBot can only use GitHub for version control.  

### Additional patterns

#### Repository
We intend to design SciBot by using the Repository pattern as part of the Data Centered patterns. Below is the interaction of clients with the centralized database. SciBot interacts with all the clients and fetches the data from the database. Any data fed into the system is stored in to the centralized database. The functionalities of the SciBot depend on the data stored in the central repository.
![Repository Model](Repository/RepositoryModel.png?raw=true "Repository Model")

#### Object Oriented  
We intend to design SciBot by using the object-oriented pattern as part of the Call and Return patterns. On a high level, the class diagram for the bot is as shown below. *BotEngine* is the main class for the bot functioning and it interacts with rest of the components/classes (*SlackApiManager*, *GithubApiManager*, *EventManager*, and *ParserEngine*) via aggregation.

![Class Diagram](ClassDiagram/ClassDiagram.jpg?raw=true "Class Diagram")

#### Implicit Invocation
We intend to design SciBot by using the Implicit Invocation as part of the Event Systems. SciBot receives the Sprint plan from the admin, parses it and stores it into the database. Once the plan is obtained, it notifies the users based on the time and plan implicitely without any external invocation.
