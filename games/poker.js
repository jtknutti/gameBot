const Deck = require("./deck.js");
const Player = require("./player.js");
const Discord = require("discord.js");
module.exports = class Poker {
  constructor(client, host, channel) {
    this.deck = undefined;
    this.client = client;
    this.channel = channel;
    this.players = [new Player(host)];
    this.gameState = "not started";
    this.gameName = "poker";
    this.smallBlind = 1;
    this.bigBlind = 0;
    this.currentBet = 0;
    this.minBet = 5;
    this.curPlayer = undefined;
    console.log("Poker object created");
  }
  handleCommand(message) {
    if (message.content === "!start") {
      if (this.isPlaying(message.member)) {
        if (this.players.length < 2) {
          message.channel.send("You need at least 2 players to start!");
        } else {
          message.channel.send("Dealing Cards...");
          this.startGame();
        }
      }
    } else if (message.content === "!join") {
      if (this.players.length < 7) {
        if (!this.isPlaying(message.member)) {
          if (!(this.gameState === "playing")) {
            message.channel.send(`${message.author} has joined the game!`);
            this.players.push(new Player(message.member));
          } else {
            message.channel.send(
              "The game has started, wait till the end of this hand to join!"
            );
          }
        } else {
          message.channel.send(
            `You're already in the game, ${message.member.displayName}!`
          );
        }
      } else {
        message.channel.send(
          `Sorry ${message.member.displayName}, the game is full!`
        );
      }
    } else if (message.content === "!players") {
      for (var player of this.players) {
        message.channel.send(`${player.member.displayName}`);
      }
    } else if (message.content === "!hand") {
      if (this.isPlaying(message.member)) {
        this.getHand(this.getPlayer(message.member), message.author);
      }
    } else if (message.content === "!quit") {
      if (this.isPlaying(message.member)) {
        this.players.splice(
          this.players.indexOf(this.getPlayer(message.member))
        );
      }
    } else if (this.gameState === "playing") {
      // commands only for ingame
      if (message.member === this.getCurPlayer().member) {
        if (message.content === "!check") {
          console.log("Check");
          this.nextPlayer();
        } else if (message.content === "!call") {
          console.log("Call");
          this.nextPlayer();
        } else if (message.content.startsWith("!raise")) {
          console.log("Raise");
          this.nextPlayer();
        } else if (message.content === "!fold") {
          this.getCurPlayer().folded = true;
          console.log("Fold");
          this.nextPlayer();
        }
      }
    }
  }
  startGame() {
    this.deck = new Deck();
    this.gameState = "playing";
    this.curPlayer = 0;
    for (var i = 0; i < 2; ++i) {
      for (var player of this.players) {
        player.hand.push(this.deck.cards.shift());
      }
    }
    for (var player of this.players) {
      this.getHand(player, player.member.user);
    }
    this.players[this.bigBlind].bet(this.minBet);
    this.players[this.smallBlind].bet(this.minBet / 2);
    this.channel
      .send(`Big Blind: ${this.players[this.bigBlind].member.displayName}
Small Blind: ${this.players[this.smallBlind].member.displayName}
Minimum Bet: $${this.minBet}`);
    this.startTurn();
  }
  startTurn() {
    this.channel.send(`${this.getCurPlayer().member.displayName}'s turn!`);
  }
  isPlaying(member) {
    for (var player of this.players) {
      if (player.member.user.username === member.user.username) {
        return true;
      }
    }
    return false;
  }
  bet(player, amount) {}
  getPlayer(member) {
    for (var player of this.players) {
      if (player.member === member) {
        return player;
      }
    }
  }
  getCurPlayer() {
    return this.players[this.curPlayer];
  }
  nextPlayer() {
    if (this.curPlayer + 1 < this.players.length) {
      this.curPlayer = this.curPlayer + 1;
      if (this.players[this.curPlayer].folded) {
        this.nextPlayer();
      } else {
        this.startTurn();
      }
    } else {
      this.curPlayer = 0;
      this.startTurn();
    }
  }
  getHand(player, author) {
    if (player.hand.length > 0) {
      author.send(`${player.member.displayName}'s hand:`);
      author.send({
        files: [
          `resources/${player.hand[0].value}${player.hand[0].suit}.png`,
          `resources/${player.hand[1].value}${player.hand[1].suit}.png`
        ]
      });
    }
  }
};
