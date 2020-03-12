module.exports = class Player {
  constructor(member) {
    this.member = member;
    this.hand = [];
    this.cash = 500;
    this.currentBet = 0;
    this.folded = false;
  }
  bet(amount) {
    if (amount <= this.cash) {
      this.cash = this.cash - amount;
      this.currentBet = amount;
    }
  }
};
