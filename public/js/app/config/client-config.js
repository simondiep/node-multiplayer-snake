define(function () {
    "use strict";

    let ClientConfig = {
        FPS: 60,
        IO: {
            INCOMING: {
                NEW_STATE: "game update",
                NEW_PLAYER_INFO: "new player info",
                BOARD_INFO: "board info",
                NOTIFICATION: "server notification"
            },
            OUTGOING: {
                COLOR_CHANGE: "player changed color",
                FOOD_CHANGE: "food change",
                SPEED_CHANGE: "speed change",
                NEW_PLAYER: "new player",
                NAME_CHANGE: "player changed name",
                KEY_DOWN: "key down"
            }
        },
        MAX_NAME_LENGTH: 10,
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

    return ClientConfig;

}); 