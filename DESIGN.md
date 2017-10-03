# Design Milestone

## Problem Statement
Agile Scrum is an iterative and incremental framework for managing software product development. There are three core roles in the Scrum process viz, the product owner, the development team and the Scrum master. Each of the roles have sophisticated task lists which they need to manage and work upon. The role of a Scrum master is unique in the Scrum process. The Scrum master is accountable for removing impediments to the ability of the team to deliver the product goals and deliverables. Having a trustworthy and self-sufficient Scrum master is a big challenge (problem). Our project the **SciBot**, is a lighter version of the Scrum master. It intends to assists the product owner (or Admin) and the product dev team adhere to the Scrum framework and ease their work in accomplishing the goal.

## Bot Description  
The **SciBot** is an easy to use bot that helps the user keep track of the sprint activities.
The scrum agile methodology is a well-known methodology for the Software Development Lifecycle Management. Sprint being the core of the scrum holds an important role in the development of a product. As a part of scrum, teams collaborate to list down the project requirements. Scrum is further divided into sprint cycles that monitor the flow of development. Daily sprint activities help the teams to meet the project targets and deadlines within time period and gives abilities to perform better.  The Scrum master generates the sprint tasks and assigns them to the team members.  

A major issue involved in this scenario can be identified as the daily management of the sprint tasks and their requirements. A SciBot user needs an automated manager to help the user monitor these activities and assist in the daily tasks.  

The following are the reasons why the SciBot is of help in this situation,
* The user does not need to manually keep track of the daily sprint activities
* The SciBot can generate reminders for the user in case the user forgets the tasks or does not push them
* The SciBot can specifically be helpful for the scrum master to keep track of the tasks for different team members and monitor their contributions according to the requirements specified in the file given by the user.  
* It can help the scrum master to ping the team members to ensure the completion of sprint tasks.  

The SciBot belongs to the category of Responders. It keeps track of the tasks to be performed and generates reminders for the tasks as the deadline approaches. It can differentiate between different users and identify their tasks independently. It maintains a memory to store all the data related to the user, tasks, deadlines and any other specific requirements of the scrum master.

### Use Cases
```
USECASE 1: Pinging a user for daily updates

The first use case is to schedule a daily scrum and ask the users questions regarding the work done to get daily updates.
1 Preconditions
  User must have a GitHub account to push all the work done on a daily basis
  User must have a Slack account and be member of the team they are working with
2 Main Flow
  At the end of the day the bot will remind the user to update his daily status[S1] at a particular time of the day, Then bot will ask the user daily scrum meeting questions [S2], like what he did yesterday, what he will be doing today and if he faced any obstacles. Then this information will be saved in database as their status update [S3].
3 Sub Flow
  [S1] The bot will remind the user to update his daily status
  [S2] Then bot will ask the user daily scrum meeting questions
  [S3] This information will be saved in their status update
4 Alternative Flows
  [E1] No team members available
  [E2] The user is not at work for that day
```
```
USECASE 2: Generating a summary report

The second use case is using the daily status collected from each user the bot will generate a summary report.
1 Preconditions
  The users must have put promptly entered their everyday work
  The admin should have a GitHub and Slack account as well
2 Main Flow
  The daily update collected, is stored in a database [S1] to help keep track of what has been done. The database having saved all the previous activities will all the information, The bot retrieves this information and puts them together to get a summary of the work done[S2].
3 Sub Flows
  [S1] The daily update collected, is stored in a database
  [S2] The bot retrieves this information and puts them together to get a summary of the work done.
4 Alternative Flows
  [E1] User has not updated their work
```
```
USECASE 3: Providing a manager/admin the ability to confiure the setup days/times of the bot.

One more use of this bot for the admin, i.e. the manager to configure the bot to set up days/times of the bot's ping and summary report.
1 Preconditions
  The admin must have a Slack account and a github account
  The admin must have permissions to configure the bot.
2 Main Flow
  The admin can configure this bot's timings for pinging [S1] the user everyday.The admin can also decide and accordingly configure the bot as to how often they want the summary report to be generated [S2].
3 Sub Flows
  [S1] The admin can configure this bot's timings for pinging
  [S2] The admin can also decide and accordingly configure the bot as to how often they want the summary report to be generated
4 Alternative Flows
  [E1] The admin must have a Slack account and a github account
  [E2] The admin must have permissions to configure the bot.
  [E3] The admin has to setup and configure the bot to work.

```

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
![StoryBoard](StoryBoard/StoryBoard.png?raw=true "StoryBoard")

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
* It will establish entitlements for different users and thus defining the permissions for all the users to do various tasks. Example: The Admin will have the functionality to create and assign tasks to different team members. The team members cannot create tasks thus limiting their entitlements  
* SciBot can only interact with one user at a time. Thus it can take input from one user at a specific instant 
* SciBot makes API calls to GitHub and Slack. It relies on GitHub and Slack API being statically incorporated into the functions. If any changes are made to the GitHub and Slack API, they will be needed to be manually updated in the bot   
* The SciBot can only use GitHub for version control  

### Additional patterns

#### Blackboard
We intend to design SciBot by using the Blackboard pattern as part of the Data Centered Patterns. Below is the interaction of clients with the centralized database. SciBot interacts with all the clients and collects the daily statuses from the users and stores it in the database. All the users acting as knowledge sources can concurrently post their updates to the SciBot which will be collected and saved to the database. All these updates from the team members is later used to generate the summary report. The functionalities of the SciBot depend on the data stored in the central repository.
![Blackboard Model](Blackboard/BlackboardModel.png?raw=true "Blackboard Model")

#### Object Oriented  
We intend to design SciBot by using the object-oriented pattern as part of the Call and Return patterns. On a high level, the class diagram for the bot is as shown below. *BotEngine* is the main class for the bot functioning and it interacts with rest of the components/classes (*SlackApiManager*, *GithubApiManager*, *EventManager*, and *ParserEngine*) via aggregation.

![Class Diagram](ClassDiagram/ClassDiagram.jpg?raw=true "Class Diagram")

#### Implicit and Explicit Invocation
We intend to design SciBot by using a hybrid of both Explict and the Implicit Invocations as part of the Event Systems. SciBot receives the plan from the admin, parses it and stores it into the database. Once the plan is obtained, it notifies the users based on the time and plan implicitely without any external invocation. But the admin can also configure the notification times of the SciBot which requires the functionality of explict invocation.
