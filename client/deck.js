var cardjs;

if (typeof window != "undefined") exports = {};
if (typeof window == "undefined") cardjs = require("./card.js");

var random = exports.random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

class Deck {
  constructor() {
    this.cards = [];
    for (var i = 2; i < 15; i++) {
      for (var j = 0; j < 4; j++) {
        var card = (typeof window == "undefined" ? new cardjs.Card(i, j) : new Card(i, j));
        this.cards.push(card);
      }
    }
  }

  shuffle() {
    for (var i in this.cards) {
      var indexReplace = random(0, this.cards.length);
      var temp = this.cards[i];
      this.cards[i] = this.cards[indexReplace];
      this.cards[indexReplace] = temp;
    }
  }
}

exports.Deck = Deck;

if (typeof window != "undefined") delete exports;
