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
  console.log('IRC error: ', message);
});

// Listen for any message and only respond to commands in a channel
// commands are in form "!command commandText"
bot.addListener("message", function(from, to, text, message) {
  if (to !== config.botName) {
    let words = text.split(" ");
    if (words.length <= 1 || words[0][0] !== '!') {
      return; // not a command
    }

    switch (words[0]) {
      case '!timeat':
        handleTimeAtCommand(to, words);
        break;
      case '!timepopularity' :
        handleTimePopularityCommand(to, words);
        break;
      default:
        return; // unsupported command, do nothing
    }
  }
});

function handleTimePopularityCommand(to, words) {
  let popularity = timeController.getPopularityForLocation(words[1]);
  bot.say(to, popularity); // channel response
}

function handleTimeAtCommand(to, words) {
  timeController.getTimeForLocation(words[1]).then((response) => {
    bot.say(to, response); // channel response
  }).catch((err) => {
    console.log('error in index.js::message handler', err)
  });
}

// catch sigint to save state
// special case for windows
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  // save state on exit
  timeController.saveStateFile();
  process.exit();
});

console.log("Listening for commands on " + config.channels.toString());
