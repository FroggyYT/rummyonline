var s = io();

var preloadCards = [];
for (var i = 2; i < 14; i++) {
  for (var j = 0; j < 4; j++) {
    var card = new Card(i, j);
    preloadCards.push(card);
  }
}

for (var i of preloadCards) {
  preloadImage(i.assetName);
}
