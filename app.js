"use strict";
const path = require("path");
const GameController = require("./controllers/game-controller");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const favicon = require('serve-favicon');

// Expose all static resources in /public
app.use(express.static(path.join(__dirname, "public"), { maxAge: 0 }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// Redirect to the main page
app.get("/", function(request, response){
    response.sendFile("game.html", { root: path.join(__dirname, "views") });
});

// Create the main controller
new GameController(io);

const SERVER_PORT = process.env.PORT || 3000;
app.set("port", SERVER_PORT);

// Start Express server
server.listen(app.get("port"), function() {
  console.log("Express server listening on port %d in %s mode", app.get("port"), app.get("env"));
});

module.exports = app;
