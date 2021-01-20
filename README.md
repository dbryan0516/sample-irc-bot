# IRC Chatbot

## Usage notes
This project was developed on MacOS.


To run from a command line: 
- `npm install`
- `npm start`

This bot uses the node-irc package to connect to 1 or more IRC channels. The channel(s), chatbot name, and server are all specified in the config.json file.

It requests timezone information from the [World Time API](http://worldtimeapi.org/). This API can be changed by overriding the environment variable `TIME_API`. 

The state of the bot is saved into a json file (timepopularity.json). This file path can be changed by specifying the environment variable `STATE_FILE_PATH`.

Commands: 
- `!timeat - returns the time at the location passed in. ex !timeat America/New_York`
- `!timepopularity - returns the number of times a location's time has been requested. ex. !timepopularity America or  !timepopularity America/New_York`
