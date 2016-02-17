"use strict";

let ServerConfig = {
    FOOD_AMOUNT : 3,
    FOOD_COLOR : "lightgreen",
    FPS: 8,
    IO: {
        DEFAULT_CONNECTION: "connection",
        INCOMING: {
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
    }
    
};

module.exports = ServerConfig;  