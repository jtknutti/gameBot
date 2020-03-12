class Card {
  constructor(suit, value) {
    this.suit = suit;

    this.value = value;
  }
}

module.exports = class Deck {
  // card values are numeric, 2-10 are numbers
  // 11 = jack, 12 = queen, 13 = king, 14 = ace
  constructor() {
    this.cards = [];
    for (var i = 0; i < 4; ++i) {
      if (i === 0) {
        for (var j = 2; j < 15; ++j) {
          this.cards.push(new Card("H", j));
        }
      } else if (i === 1) {
        for (var j = 2; j < 15; ++j) {
          this.cards.push(new Card("D", j));
        }
      } else if (i === 2) {
        for (var j = 2; j < 15; ++j) {
          this.cards.push(new Card("S", j));
        }
      } else if (i === 3) {
        for (var j = 2; j < 15; ++j) {
          this.cards.push(new Card("C", j));
        }
      }
    }
    this.shuffleDeck();
  }
  shuffleDeck() {
    for (var i = this.cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
  dumpCards() {
    for (var i = 0; i < 52; ++i) {
      console.log(this.cards[i]);
    }
  }
};
