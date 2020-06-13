const irc = require("irc");
const config = require('./config.json');
const TimeController = require('./timeController');
const timeController = new TimeController();

// Initial reference: https://davidwalsh.name/nodejs-irc
// Create the bot
const bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// IRC error handler
bot.addListener('error', function(message) {
  console.log('error: ', message);
});

// Listen for any message, say to him/her in the room
bot.addListener("message", function(from, to, text, message) {
  timeController.getTimeForLocation('America/New_York').then((response)  => {
    if (to === config.botName) {
      bot.say(from, response); // pm
    } else {
      bot.say(to, response); // channel
    }
  }).catch((err) => {
    console.log('error in index.js::message handler', err)
  });
});

console.log("Listening for commands on " + config.channels.toString());
