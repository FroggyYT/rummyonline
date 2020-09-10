var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");
var cardjs = require("./client/card.js");
var deckjs = require("./client/deck.js");

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/loginredirect.html")
});

app.get("/login", function(req, res) {
	res.sendFile(__dirname + "/client/login.html");
})

app.get("/dashboard", function(req, res) {
	res.sendFile(__dirname + "/client/dashboard.html");
});

app.get("/leaderboard", function(req, res) {
	res.sendFile(__dirname + "/client/leaderboard.html");
});

app.get("/game", function(req, res) {
	res.sendFile(__dirname + "/client/game.html");
});

app.use("/client", express.static(__dirname + "/client"));

server.listen(process.env.PORT || 80);

var io = require("socket.io")(server,{});








var PLAYERS = [];
var SOCKETS = [];

var currentDeck;
var gameRunning = false;
var timeUntilGameStart = 120;
var currentTimeUntilGameStart = timeUntilGameStart;

var waitToSendHand = false;

function startGame() {
	console.log("h");
	currentDeck = new deckjs.Deck();
	currentDeck.shuffle();
	distributeCards();
}

function distributeCards() {
	for (var i = 0; i < 7; i++) {
		for (var j in PLAYERS) {
			PLAYERS[j].hand.push(currentDeck[0])
			currentDeck.splice(0, 1);
		}
	}

	waitToSendHand = true;
}






class Player {
	constructor(_name, _socket) {
		this.name = _name;
		this.pSocket = _socket
		this.hand = [];
	}

	remove() {
		for (var i in PLAYERS) {
			if (PLAYERS[i].pSocket.socket.id == this.pSocket.socket.id) {
				PLAYERS.splice(i, 1);
			}
		}
	}
}

class PlayerSocket {
	constructor(_socket) {
		this.socket = _socket;
	}

	remove() {
		for (var i in SOCKETS) {
			if (SOCKETS[i].socket.id == this.socket.id) {
				SOCKETS.splice(i, 1);
			}
		}
	}
}













setInterval(() => {
	// console.log(gameRunning);
	// console.log(PLAYERS.length);
	if (!gameRunning && PLAYERS.length > 0) {
		gameRunning = true;
		startGame();
	}
}, 1000);

io.on("connection", s => {
	var pSock = new PlayerSocket(s);

	SOCKETS.push(pSock);

	s.pSocket = pSock;
	s.inGame = false;

	s.on("checkValidName", d => {
		var valid = true;
		if (d == "") {
			valid = false;
			s.emit("nameFail", "Display name can not be blank");
		}
		for (var i in PLAYERS) {
			if (PLAYERS[i].name == d) {
				valid = false;
				s.emit("nameFail", "Display name is already in use");
			}
		}
		if (d.length > 15) {
			valid = false;
			s.emit("nameFail", "Display name must be less than 15 characters");
		}
		if (gameRunning) {
			valid = false;
			s.emit("nameFail", "There is already a game running");
		}

		if (valid) {
			s.emit("validNameResponse", valid);
		}
	});

	s.on("login", d => {
		var accounts = JSON.parse(fs.readFileSync("accounts.json"));
		d[0] = d[0].toLowerCase();
		d[1] = d[1].toLowerCase();

		if (accounts[d[0]]) {
			if (accounts[d[0]] == d[1]) {
				s.emit("loginSuccess");
				s.emit("call", `localStorage.setItem("username", "${d[0]}")`);
				s.emit("call", `localStorage.setItem("password", "${d[1]}")`);
			} else {
				s.emit("loginFail", "Password is incorrect!");
			}
		} else {
			s.emit("loginFail", "Account with this name does not exist!");
		}
	});

	s.on("signup", d => {
		var accounts = JSON.parse(fs.readFileSync("accounts.json"));
		d[0] = d[0].toLowerCase();
		d[1] = d[1].toLowerCase();

		if (accounts[d[0]]) {
			s.emit("signupFail", "Account already exists with this name!");
		} else {
			accounts[d[0]] = d[1];
			var data = JSON.stringify(accounts, null, 2);
			fs.writeFileSync("accounts.json", data);
			s.emit("signupSuccess");
			s.emit("call", `localStorage.setItem("username", "${d[0]}")`);
			s.emit("call", `localStorage.setItem("password", "${d[1]}")`);

			var stats = JSON.parse(fs.readFileSync("stats.json"));
			var defaultStats = {
				"money": 100,
		    "wins": 0,
		    "losses": 0,
		    "draws": 0
			};
			stats[d[0]] = defaultStats;

			var data = JSON.stringify(stats, null, 2);
			fs.writeFileSync("stats.json", data);
		}
	});

	s.on("checkLoggedInValidation", d => {
		var accounts = JSON.parse(fs.readFileSync("accounts.json"));
		d[0] = d[0].toLowerCase();
		d[1] = d[1].toLowerCase();

		if (accounts[d[0]] == d[1]) {
			s.emit("logInValidation", true);
		} else {
			s.emit("logInValidation", false);
		}
	});

	s.on("getStats", d => {
		var stats = JSON.parse(fs.readFileSync("stats.json"));

		if (stats[d]) {
			s.emit("stats", [d, stats[d]]);
		} else {
			s.emit("stats", [d, {"money": 0, "wins": 0, "losses": 0, "draws": 0}]);
		}
	});

	s.on("getAccountList", d => {
		var stats = JSON.parse(fs.readFileSync("stats.json"));

		s.emit("accountList", Object.keys(stats));
	});

	s.on("getAccountListSorted", d => {
		var stats = JSON.parse(fs.readFileSync("stats.json"));
		var accounts = Object.keys(stats);
		var sortedAccounts = accounts;
		for (var i in sortedAccounts) {
	    for (var j in sortedAccounts) {
	      if (sortedAccounts[i] > sortedAccounts[j]) {
	        var temp = sortedAccounts[i];
	        sortedAccounts[i] = sortedAccounts[j];
	        sortedAccounts[j] = temp;
	      }
	    }
	  }

		s.emit("accountList", sortedAccounts);
	});

	s.on("joinGame", d => {
		s.player = new Player(d, s.pSocket);
		// console.log(s.player);
		s.inGame = true;
		PLAYERS.push(s.player);
		console.log(PLAYERS);
	});


	setInterval(() => {
		if (waitToSendHand) {
			waitToSendHand = false;
			s.emit("hand", s.player.hand);
		}
		console.log(PLAYERS.length);
	}, 1000);







	s.on("disconnect", () => {
		s.pSocket.remove();
		console.log("h");
		if (s.inGame) {
			s.player.remove();

			if (gameRunning) {
				for (var i in s.player.hand) {
					currentDeck.push(s.player.hand[i]);
				}
			}
		}
	});
});
