var path = require("path");
var GameController = require("./controllers/game-controller");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

// Expose all static resources in /public
app.use(express.static(path.join(__dirname, "public"), { maxAge: 0 }));

// Redirect to the main page
app.get("/", function(request, response){
    response.sendFile("game.html", { root: path.join(__dirname, "views") });
});

// Create the main controller
new GameController(io);

var SERVER_PORT = process.env.PORT || 3000;
app.set("port", SERVER_PORT);

// Start Express server
server.listen(app.get("port"), function() {
  console.log("Express server listening on port %d in %s mode", app.get("port"), app.get("env"));
});

module.exports = app;
