var express = require("express");
var app = express();
var server = require("http").Server(app);

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/index.html");
})

app.use("/client", express.static(__dirname + "/client"));

server.listen(process.env.PORT || 2020);

var io = require("socket.io")(server,{});

io.on("connection", () => {

});