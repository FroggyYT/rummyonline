const ASSET_TEMPLATE = "./client/assets/{NUM}_of_{FACE}.png";

const HEARTS = 0;
const CLUBS = 1;
const DIAMONDS = 2;
const SPADES = 3;

const FACES = [ HEARTS, CLUBS, DIAMONDS, SPADES ];

const RED = [255, 0, 0];
const BLACK = [0, 0, 0];

const COLORS = [ RED, BLACK, RED, BLACK ];

const JACK = 11;
const QUEEN = 12;
const KING = 13;
const ACE = 14;
const LOW_ACE = 1;

const FACE_NAMES = [ "hearts", "clubs", "diamonds", "spades" ];

const NUM_NAMES = [ 0, "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace" ];

const VALUES = [ 0, 15, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 15 ];

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









// Preload images

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
