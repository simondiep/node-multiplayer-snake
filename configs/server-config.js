"use strict";

let ServerConfig = {
    DEFAULT_FOOD_AMOUNT : 3,
    FOOD_COLOR : "red",
    DEFAULT_FPS: 8,
    MAX_FPS: 60,
    PLAYER_STARTING_LENGTH: 5,
    SPAWN_TURN_LEEWAY: 10,
    DEFAULT_STARTING_BOTS: 0,
    MAX_BOTS: 20,
    BOT_CHANGE_DIRECTION_PERCENT: 0.2,
    BOT_MAX_CHANGE_DIRECTION_ATTEMPTS: 10,
    IO: {
        DEFAULT_CONNECTION: "connection",
        INCOMING: {
            BOT_CHANGE: "bot change",
            COLOR_CHANGE: "player changed color",
            FOOD_CHANGE: "food change",
            SPEED_CHANGE: "speed change",
            START_LENGTH_CHANGE: "start length change",
            JOIN_GAME: "join game",
            SPECTATE_GAME: "spectate game",
            IMAGE_UPLOAD: "image upload",
            NEW_PLAYER: "new player",
            NAME_CHANGE: "player changed name",
            KEY_DOWN: "key down",
            DISCONNECT: "disconnect"
        },
        OUTGOING: {
            NEW_STATE: "game update",
            NEW_PLAYER_INFO: "new player info",
            BOARD_INFO: "board info",
            NOTIFICATION: "server notification"
        }
    },
    INCREMENT_CHANGE: {
        INCREASE: "increase",
        DECREASE: "decrease",
        RESET: "reset"
    }
    
};

module.exports = ServerConfig;  