var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");

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

var gameRunning = false;
var timeUntilGameStart = 120;
var currentTimeUntilGameStart = timeUntilGameStart;

class Player {
	constructor(_name, _socket) {
		this.name = _name;
		this.pSocket = _socket
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


function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

class Deck {
  constructor() {
    this.cards = [];
    for (var i = 2; i < 15; i++) {
      for (var j = 0; j < 4; j++) {
        var card = new Card(i, j);
        this.cards.push(card);
      }
    }
  }

  shuffle() {
    for (var i in this.cards) {
      var indexReplace = random(0, this.cards.length);
      var temp = this.cards[i];
      this.cards[i] = this.cards[indexReplace];
      this.cards[indexReplace] = temp;
    }
  }
}















io.on("connection", s => {
	var pSock = new PlayerSocket(s);

	SOCKETS.push(pSock);

	s.pSocket = pSock;

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
		PLAYERS.push(s.player);
	});

	s.on("disconnect", () => {
		s.pSocket.remove();
	});
});
