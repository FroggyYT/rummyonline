if (typeof window != "undefined") exports = {};

const ASSET_TEMPLATE = exports.ASSET_TEMPLATE = "./client/assets/{NUM}_of_{FACE}.png";

const HEARTS = exports.HEARTS = 0;
const CLUBS = exports.CLUBS = 1;
const DIAMONDS = exports.DIAMONDS = 2;
const SPADES = exports.SPADES = 3;

const FACES = exports.FACES = [ HEARTS, CLUBS, DIAMONDS, SPADES ];

const RED = exports.RED = [255, 0, 0];
const BLACK = exports.BLACK = [0, 0, 0];

const COLORS = exports.COLORS = [ RED, BLACK, RED, BLACK ];

const JACK = exports.JACK = 11;
const QUEEN = exports.QUEEN = 12;
const KING = exports.KING = 13;
const ACE = exports.ACE = 14;
const LOW_ACE = exports.LOW_ACE = 1;

const FACE_NAMES = exports.FACE_NAMES = [ "hearts", "clubs", "diamonds", "spades" ];

const NUM_NAMES = exports.NUM_NAMES = [ 0, "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace" ];

const VALUES = exports.VALUES = [ 0, 15, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 15 ];

class Card {
	constructor(_num, _face) {
		this.face = _face;
		this.num = _num;
		this.faceName = FACE_NAMES[this.face];
		this.numName = NUM_NAMES[this.num];
		this.cardName = `${this.numName}-of-${this.faceName}`
		this.assetName = ASSET_TEMPLATE.split("{NUM}").join(this.numName).split("{FACE}").join(this.faceName);
	}
}

class CardElement {
	constructor(_card, _flipped) {
		this.card = _card;
		this.assetName = this.card.assetName;
		this.backAssetName = "./client/assets/back.png";
		this.img = document.createElement("img");
		this.img.width = "125";
		this.img.height = "180";
		this.flipped = _flipped;
		this.img.src = this.flipped ? this.backAssetName : this.assetName;
	}

	appendTo(element) {
		element.append(this.img);
	}

	flip() {
		this.flipped = !this.flipped;
		this.img.src = this.flipped ? this.backAssetName : this.assetName;
	}
}

exports.Card = Card;
exports.CardElement = CardElement;









// Preload images

if (typeof window != "undefined") {
	delete exports;

	var preloadCards = [];
	for (var i = 2; i < 15; i++) {
	  for (var j = 0; j < 4; j++) {
	    var card = new Card(i, j);
	    preloadCards.push(card);
	  }
	}

	for (var i of preloadCards) {
	  preloadImage(i.assetName);
	}
}
