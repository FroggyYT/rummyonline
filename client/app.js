var s = io();

var preloadCards = [];
for (var i = 2; i < 14; i++) {
  for (var j of FACE_NAMES) {
    var card = new Card(NUM_NAMES, j);
    preloadCards.push(card);
  }
}

for (var i of preloadCards) {
  preloadImage(i.assetName);
}
