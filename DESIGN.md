# Design Document

## Problem Statement

## Bot Description

## Use Cases

#### USECASE 1: Collect Daily tasks and keep track of the commits

The first use case is for sending reminders to the users i.e. team members to commit at the end of the day and if the user does not commit then shows the time overdue.

**1. Preconditions**

User must have a GitHub account to push all the work done on a daily basis.

User must have a slack account and be member of the team they are working with.

**2. Main Flow**

The user will inform the bot that they are done for the day [S1], then the bot will notify and remind the user that it is time to commit the work done [S2]. Also, it shows users overdue tasks with time if they have not committed previously [S3], to prevent users from slacking in their work.

**3. Sub Flow**

[S1] The user will inform the bot that they are done for the day.

[S2] The bot will remind the user that it is time to commit the work done.

[S3] The bot shows them tasks overdue with time.

**4. Alternative Flows**

No team members available.

The user is not at work for that day.

#### USECASE 2: Creation and assignment of tasks**

The second use case is for the admin i.e., the team lead to create and assign tasks to the different team members.

**1. Preconditions**

The admin is the only person who can directly assign and configure the bot.

The admin should have a GitHub and slack account as well.

**2. Main Flow**

Instead of the admin sending out separate emails to each person with their tasks, they will just need to upload the task assignment to the bot [S1] and the bot will take care of notifying the team members of their tasks [S2]. The different tasks will be assigned to the team members according to what the admin has sent to the bot.

**3. Sub Flows**

[S1] The admin will upload a file with the team members and their respective tasks

[S2] The bot then notifies the team members of the tasks they have been assigned

**4. Alternative Flows**

No tasks need to be assigned.

One or more team members don&#39;t have any tasks assigned to them.

#### USECASE 3: Notification the tasks due

One more use of this bot is to collect daily tasks and activities of the users i.e. the team members. It is used notifying the users who are working on the project with the tasks due and provide a list of tasks due with priority.

**1. Preconditions**

User must have a GitHub account to push all the work done on a daily basis.

The user must also have a slack account and be member of the team he is working with.

**2. Main Flow**

The user will log into the system in the morning and then ask the bot what are the tasks for today [S1] to help keep track of what should be done. The bot having saved all the previous activities will provide a list of tasks that should be dealt with immediately which are of utmost importance [S2] and then the other tasks after.

**3. Sub Flows**

[S1] The user asks the bot what are the tasks for today.

[S2] The bot replies with a list of tasks with priority according to which one should be dealt with first.

**4. Alternative Flows**

All the tasks have already been completed before hand

Too many tasks are remaining and the user cannot complete everything.

## Design Sketches

### Wireframe  
The following mockups bring out our bot idea and let you check SciBot in action. Additionally, you can access its prototype [here](https://app.walkiebot.co/anon/2n90g-5htfz/story/daily-scrum-meeting "View prototype").

* SciBot as a Scrum Master for daily status updates
![Standup](Mockup/Standup.png?raw=true "Standup")

* Assisting the Dev Team with tasks
![DevAssistant](Mockup/DevAssistant.png?raw=true "DevAssistant")

* Keeping track of the timlines
![Notify](Mockup/Notify.png?raw=true "Notify")

* Interaction with Admin for configurations
![Configure](Mockup/Configure.png?raw=true "Configure")

## Architecture Design

## Additional Patterns

### Object Oriented  
We intend to design SciBot by using the object-oriented pattern as part of the Call and Return patterns. On a high level, the class diagram for the bot is as shown below. *BotEngine* is the main class for the bot functioning and it interacts with rest of the components/classes (*SlackApiManager*, *GithubApiManager*, *EventManager*, and *ParserEngine*) via aggregation.

![Class Diagram](ClassDiagram/ClassDiagram.jpg?raw=true "Class Diagram")
