define([
    "config/client-config"
],

function (ClientConfig) {
    "use strict";
    
    const ENTER_KEYCODE = 13;
    const SPACE_BAR_KEYCODE = 32;
    
    class GameView {
        
        constructor(keyDownCallback, playerNameUpdatedCallback, speedChangeCallback, foodChangeCallback) {
            this.keyDownCallback = keyDownCallback;
            this.playerNameUpdatedCallback = playerNameUpdatedCallback;
            this.speedChangeCallback = speedChangeCallback;
            this.foodChangeCallback = foodChangeCallback;
            this.isChangingName = false;
            this._getChangeNameButton().addEventListener("click", this._handleChangeNameButtonClick.bind(this), false);
            this._getIncreaseSpeedButton().addEventListener("click", this._handleIncreaseSpeedButtonClick.bind(this), false);
            this._getDecreaseSpeedButton().addEventListener("click", this._handleDecreaseSpeedButtonClick.bind(this), false);
            this._getResetSpeedButton().addEventListener("click", this._handleResetSpeedButtonClick.bind(this), false);
            this._getIncreaseFoodButton().addEventListener("click", this._handleIncreaseFoodButtonClick.bind(this), false);
            this._getDecreaseFoodButton().addEventListener("click", this._handleDecreaseFoodButtonClick.bind(this), false);
            this._getResetFoodButton().addEventListener("click", this._handleResetFoodButtonClick.bind(this), false);
            window.addEventListener( "keydown", this._handleKeyDown.bind(this), true);
        }
        
        updatePlayerName(playerName, playerColor) {
            this._getPlayerNameElement().value = playerName;
            this._getPlayerNameElement().style.color = playerColor;
        }
        
        ready() {
            // Show everything when ready
            document.getElementById("cover").style.visibility = "visible";
        }

        showFoodAmount(foodAmount) {
            document.getElementById("currentFoodAmount").innerHTML = foodAmount;
        }
        
        showSpeed(speed) {
            document.getElementById("currentSpeed").innerHTML = speed;
        }
        
        _getChangeNameButton() {
            return document.getElementById("changePlayerNameButton");
        }
        
        _getDecreaseFoodButton() {
            return document.getElementById("decreaseFoodButton");
        }
        
        _getDecreaseSpeedButton() {
            return document.getElementById("decreaseSpeedButton");
        }
        
        _getIncreaseFoodButton() {
            return document.getElementById("increaseFoodButton");
        }
        
        _getIncreaseSpeedButton() {
            return document.getElementById("increaseSpeedButton");
        }
        
        _getInvalidPlayerNameLabel() {
            return document.getElementById("invalidPlayerNameLabel");
        }
        
        _getPlayerNameElement() {
            return document.getElementById("playerName");
        }
        
        _getResetFoodButton() {
            return document.getElementById("resetFoodButton");
        }
        
        _getResetSpeedButton() {
            return document.getElementById("resetSpeedButton");
        }
        
        _handleChangeNameButtonClick() {
            if(this.isChangingName) {
                this._saveNewPlayerName();
            } else {
                this._getChangeNameButton().innerHTML = "Save";
                this._getPlayerNameElement().readOnly = false;
                this._getPlayerNameElement().select();
                this.isChangingName = true;
            }
        }
        
        _handleKeyDown(e) {
            // Prevent space bar scrolling default behavior
            if (e.keyCode === SPACE_BAR_KEYCODE && e.target == document.body) {
                e.preventDefault();
            }
            
            // When changing names, save new name on enter
            if(e.keyCode === ENTER_KEYCODE && this.isChangingName) {
                this._saveNewPlayerName();
                document.activeElement.blur();
                return;
            }
        
            if(!this.isChangingName) {
                this.keyDownCallback(e.keyCode);
            }
        }
        
        _handleDecreaseSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.SPEED_CHANGE.DECREASE);
        }
        
        _handleIncreaseSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.SPEED_CHANGE.INCREASE);
        }
        
        _handleResetSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.SPEED_CHANGE.RESET);
        }
        
        _handleDecreaseFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.FOOD_CHANGE.DECREASE);
        }
        
        _handleIncreaseFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.FOOD_CHANGE.INCREASE);
        }
        
        _handleResetFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.FOOD_CHANGE.RESET);
        }
        
        _saveNewPlayerName() {
            let playerName = this._getPlayerNameElement().value;
            if(playerName && playerName.trim().length > 0 && playerName.length <= ClientConfig.MAX_NAME_LENGTH) {
                this.playerNameUpdatedCallback(playerName);
                this._getChangeNameButton().innerHTML = "Change Name";
                this._getPlayerNameElement().readOnly = true;
                this.isChangingName = false;
                this._getInvalidPlayerNameLabel().style.display = "none";
            } else {
                this._getInvalidPlayerNameLabel().style.display = "inline";
            }
        }
    }

    return GameView;

});     