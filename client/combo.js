var isCombo = function(array) {
	var thisCards = array;
	var sameFace = false;
	var numIncrease = false;
	if (thisCards[0].__proto__ != new Card().__proto__) return false;
	if (thisCards.length != 3) return false;

	if (thisCards[0].num == thisCards[1].num && thisCards[1].num == thisCards[2].num) return true;

	if (thisCards[0].face == thisCards[1].face && thisCards[1].face == thisCards[2].face) sameFace = true;
	if (thisCards[1].num == thisCards[0].num + 1 && thisCards[2].num == thisCards[1].num + 1) numIncrease = true;

	return (sameFace && numIncrease);
}
