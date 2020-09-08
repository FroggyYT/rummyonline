const ASSET_TEMPLATE = "./client/assets/{NUM}_of_{FACE}.png";

const HEARTS = 0;
const CLUBS = 1;
const DIAMONDS = 2;
const SPADES = 3;

const FACES = [ HEARTS, CLUBS, DIAMONDS, SPADES ];

const RED = [255, 0, 0];
const BLACK = [0, 0, 0];

const COLORS = [ RED, BLACK, RED, BLACK ];

const JACK = 10;
const QUEEN = 11;
const KING = 12;
const ACE = 13;
const LOW_ACE = 1;

const FACE_NAMES = [ "hearts", "clubs", "diamonds", "spades" ];

const NUM_NAMES = [ 0, "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace" ];

class Card {
	constructor(_num, _face) {
		this.face = _face;
		this.num = _num;
		this.faceName = FACE_NAMES[this.face];
		this.numName = NUM_NAMES[this.num]
		this.assetName = ASSET_TEMPLATE.split("{NUM}").join(this.numName).split("{FACE}").join(this.faceName);
	}
}
