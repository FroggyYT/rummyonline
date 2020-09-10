var s = io();

s.on("hand", d => {
  console.log(d);
  for (var i in d) {
    var card = new CardElement(d[i], false);
    card.appendTo(document.body);
  }
});
