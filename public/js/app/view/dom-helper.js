define(function () {
    "use strict";

    class DomHelper {
    
        static blurActiveElement() {
            document.activeElement.blur();
        }
        
        static createElement(elementName) {
            return document.createElement(elementName);
        }
    
        static getBody() {
            return document.body;
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
    }

    return DomHelper;

});     