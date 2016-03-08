define(() => {
    'use strict';

    const ClientConfig = {
        FPS: 60,
        TURNS_TO_FLASH_AFTER_SPAWN: 10,
        TURNS_TO_SHOW_FOOD_TEXT: 20,
        CANVAS_TEXT_STYLE: 'bold 24px PressStart2P',
        SPAWN_FLASH_COLOR: 'white',
        WALL_COLOR: 'gray',
        IO: {
            INCOMING: {
                NEW_STATE: 'game update',
                NEW_PLAYER_INFO: 'new player info',
                NEW_BACKGROUND_IMAGE: 'new background image',
                BOARD_INFO: 'board info',
                NOTIFICATION: {
                    GENERAL: 'general notification',
                    FOOD_COLLECTED: 'food collected',
                    KILL: 'kill notification',
                    KILLED_EACH_OTHER: 'killed each other notification',
                    RAN_INTO_WALL: 'ran into wall notification',
                    SUICIDE: 'suicide notification',
                },
            },
            OUTGOING: {
                BOT_CHANGE: 'bot change',
                COLOR_CHANGE: 'player changed color',
                FOOD_CHANGE: 'food change',
                SPEED_CHANGE: 'speed change',
                START_LENGTH_CHANGE: 'start length change',
                JOIN_GAME: 'join game',
                SPECTATE_GAME: 'spectate game',
                CLEAR_UPLOADED_BACKGROUND_IMAGE: 'clear uploaded background image',
                BACKGROUND_IMAGE_UPLOAD: 'background image upload',
                CLEAR_UPLOADED_IMAGE: 'clear uploaded image',
                IMAGE_UPLOAD: 'image upload',
                NEW_PLAYER: 'new player',
                NAME_CHANGE: 'player changed name',
                KEY_DOWN: 'key down',
                CANVAS_CLICKED: 'canvas clicked',
            },
        },
        MAX_NAME_LENGTH: 10,
        INCREMENT_CHANGE: {
            INCREASE: 'increase',
            DECREASE: 'decrease',
            RESET: 'reset',
        },
        LOCAL_STORAGE: {
            PLAYER_IMAGE: 'node-multiplayer-snake-player-image',
            PLAYER_NAME: 'node-multiplayer-snake-player-name',
        },
    };

    return ClientConfig;
});
