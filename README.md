<p align="center">
  <img 
    src="http://res.cloudinary.com/vidsy/image/upload/v1503160820/CoZ_Icon_DARKBLUE_200x178px_oq0gxm.png" 
    width="125px"
  >
</p>

<h1 align="center">NEO Slack bot for NEO communities</h1>

<p align="center">
  This slack bot has multiple commands and uses in the main NEO Slack.
</p>

## Description
This bot is specially made for the Antshares/NEO slack. It's purpose is to provide a multitude of functionality for new and seasoned members.
It's primary function is to respond to certain text in channels and send the user a message with information.

## Roadmap

### Release 0.1 - DONE
- Auto responding bot
- Saving question data in a Mongo database
- Using NLP to find questions in chat and respond accordingly
- Give the user the option to ignore the message for a certain amount of time

### Release 0.2
- Add `/dev command`, which lists the commands available
- Add `/dev add`, which lets a user register as a developer, it will give a list of questions
    - Which skills do you have?
    - Do you have a github account?
        - Yes
        - No
    - [Yes]: Please enter your GitHub username
    - Do you want to register your wallet address?
        - Yes
        - No
    - [Yes]: Please enter your wallet address (cannot be seen by normal users, only CoZ members)
- Add `/dev addskill <skillname>`, which lets a user add a new skill to select from during registering
- Add `/dev list <@optional:skillname>`, lists all dev users, optional lists users with a skill
- Add `/dev modify`, which lets a user modify their information

### Release 0.3
- Refactor code to be more modular
- Refactor code to make use of await and async
- Add message creation framework for easy message creation

### Release 0.4
- Parse questions gathered and create proper answers
- ???
- Profit
