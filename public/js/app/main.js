define([
    "controller/game-controller",
    "socketio",
],

(GameController, io) => {
    "use strict";

    const gameController = new GameController();
    gameController.connect(io);
});
