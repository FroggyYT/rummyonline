Array.prototype.isCombo = function() {
	var cards = this;
	var sameFace = false;
	var numIncrease = false;
	if (cards[0].__proto__ != new Card().__proto__) return false;
	if (cards.length != 3) return false;

	if (cards[0].num == cards[1].num && cards[1].num == cards[2].num) return true;

	if (cards[0].face == cards[1].face && cards[1].face == cards[2].face) sameFace = true;
	if (cards[1].num == cards[0].num + 1 && cards[2].num == cards[1].num + 1) numIncrease = true;
	
	return (sameFace && numIncrease);
}