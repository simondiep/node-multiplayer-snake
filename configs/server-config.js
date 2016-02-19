"use strict";

let ServerConfig = {
    DEFAULT_FOOD_AMOUNT : 3,
    FOOD_COLOR : "lightgreen",
    DEFAULT_FPS: 8,
    MAX_FPS: 60,
    PLAYER_STARTING_LENGTH: 5,
    IO: {
        DEFAULT_CONNECTION: "connection",
        INCOMING: {
            COLOR_CHANGE: "player changed color",
            FOOD_CHANGE: "food change",
            SPEED_CHANGE: "speed change",
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
    FOOD_CHANGE: {
        INCREASE: "increase",
        DECREASE: "decrease",
        RESET: "reset"
    },
    SPEED_CHANGE: {
        INCREASE: "increase",
        DECREASE: "decrease",
        RESET: "reset"
    }
    
};

module.exports = ServerConfig;  