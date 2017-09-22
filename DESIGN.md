# Design Document

## Problem Statement

## Bot Description

## Use Cases

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