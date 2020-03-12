const Discord = require("discord.js");
const Poker = require("./games/poker.js");
const { token } = require("./config.json");
const client = new Discord.Client();

client.once("ready", () => {
  this.game = undefined;
  console.log("Ready!");
});
client.on("message", message => {
  if (!message.content.startsWith("!")) return;
  if (message.content === "!help") {
    message.channel.send(`Commands:
!poker: Start a game of poker
!end: End the current game
For game specific commands, type !help [game name]
For a list of games, type !help games`);
  } else if (this.game) {
    if (message.content === "!end") {
      if (this.game.isPlaying(message.member)) {
        console.log("ending game!");
        this.game = undefined;
      }
    } else this.game.handleCommand(message);
  } else {
    if (message.content === "!poker") {
      message.channel.send("Starting a game of Poker!");
      this.game = new Poker(client, message.member, message.channel);
    }
  }
});
client.login(token);
