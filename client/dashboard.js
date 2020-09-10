var s = io();
var displayBox;
setTimeout(callback, 100);

var loggedIn = localStorage.getItem("logged-in") == "true" ? true : false;

if (!loggedIn) {
  window.location = "/login";
} else {
  s.emit("checkLoggedInValidation", [localStorage.getItem("username") + "", localStorage.getItem("password") + ""]);
}

s.on("logInValidation", d => {
  if (!d) {
    window.location = "/login";
    localStorage.setItem("logged-in", false);
  }
});

function callback() {
  var joinButton = document.getElementById("join");
  displayBox = document.getElementById("display");
  var usernameText = document.getElementById("username");
  var logoutButton = document.getElementById("logout");
  var moneyText = document.getElementById("money");
  var winsText = document.getElementById("wins");
  var lossesText = document.getElementById("losses");
  var drawsText = document.getElementById("draws");
  var leaderboardButton = document.getElementById("leaderboard");

  leaderboardButton.addEventListener("click", () => {
    window.location = "/leaderboard";
  });

  s.emit("getStats", localStorage.getItem("username"));

  setInterval(() => {
    s.emit("getStats", localStorage.getItem("username"));
  }, 5000);

  s.on("stats", d => {
    moneyText.textContent = `Money: $${d[1].money}`;
    winsText.textContent = `Wins: ${d[1].wins}`;
    lossesText.textContent = `Losses: ${d[1].losses}`;
    drawsText.textContent = `Draws: ${d[1].draws}`;
  });

  usernameText.textContent = localStorage.getItem("username");

  logoutButton.addEventListener("click", () => {
    localStorage.setItem("logged-in", false);
    window.location = "/";
  });

  joinButton.addEventListener("click", () => {
    s.emit("checkValidName", displayBox.value);
  });
}

s.on("validNameResponse", d => {
  s.emit("joinGame", displayBox.value);
  window.location = "/game";
});

s.on("nameFail", d => {
  alert(d);
});

s.on("call", d => {
  new Function(d)();
});
