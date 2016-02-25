define(function () {
    "use strict";

    class DomHelper {
    
        static blurActiveElement() {
            document.activeElement.blur();
        }
        
        static createElement(elementName) {
            return document.createElement(elementName);
        }
    
        static getBackgroundImageUploadElement() {
            return document.getElementById("backgroundImageUpload");
        }
    
        static getBody() {
            return document.body;
        }
    
        static getClearUploadedBackgroundImageButton() {
            return document.getElementById("clearUploadedBackgroundImageButton");
        }
    
        static getClearUploadedImageButton() {
            return document.getElementById("clearUploadedImageButton");
        }
        
        static getCoverDiv() {
            return document.getElementById("cover");
        }
        
        static getCurrentFoodAmountLabel() {
            return document.getElementById("currentFoodAmount");
        }
        
        static getCurrentNumberOfBotsLabel() {
            return document.getElementById("currentNumberOfBots");
        }
        
        static getCurrentSpeedLabel() {
            return document.getElementById("currentSpeed");
        }
        
        
        static getCurrentStartLengthLabel() {
            return document.getElementById("currentStartLength");
        }
        
        static getChangeColorButton() {
            return document.getElementById("changePlayerColorButton");
        }
        
        static getChangeNameButton() {
            return document.getElementById("changePlayerNameButton");
        }
        
        static getDecreaseBotsButton() {
            return document.getElementById("decreaseBotsButton");
        }
        
        static getDecreaseFoodButton() {
            return document.getElementById("decreaseFoodButton");
        }
        
        static getDecreaseSpeedButton() {
            return document.getElementById("decreaseSpeedButton");
        }
        
        static getDecreaseStartLengthButton() {
            return document.getElementById("decreaseStartLengthButton");
        }
        
        static getFullScreenButton() {
            return document.getElementById("fullScreenButton");
        }
        
        static getGameBoardDiv() {
            return document.getElementById("gameBoard");
        }
        
        static getImageUploadElement() {
            return document.getElementById("imageUpload");
        }
        
        static getIncreaseBotsButton() {
            return document.getElementById("increaseBotsButton");
        }
        
        static getIncreaseFoodButton() {
            return document.getElementById("increaseFoodButton");
        }
        
        static getIncreaseSpeedButton() {
            return document.getElementById("increaseSpeedButton");
        }
        
        static getIncreaseStartLengthButton() {
            return document.getElementById("increaseStartLengthButton");
        }
        
        static getInvalidPlayerNameLabel() {
            return document.getElementById("invalidPlayerNameLabel");
        }
        
        static getNotificationsDiv() {
            return document.getElementById("notifications");
        }
        
        static getPlayerNameElement() {
            return document.getElementById("playerName");
        }
        
        static getPlayerStatsDiv() {
            return document.getElementById("playerStats");
        }
        
        static getPlayOrWatchButton() {
            return document.getElementById("playOrWatchButton");
        }
        
        static getResetBotsButton() {
            return document.getElementById("resetBotsButton");
        }
        
        static getResetFoodButton() {
            return document.getElementById("resetFoodButton");
        }
        
        static getResetSpeedButton() {
            return document.getElementById("resetSpeedButton");
        }
        
        static getResetStartLengthButton() {
            return document.getElementById("resetStartLengthButton");
        }
        
        static getToggleGridLinesButton() {
            return document.getElementById("toggleGridLinesButton");
        }
        
        static toggleFullScreenMode() {
            if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
    }

    return DomHelper;

});     