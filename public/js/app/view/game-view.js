define([
    "config/client-config",
    "view/dom-helper"
],

function (ClientConfig, DomHelper) {
    "use strict";
    
    const ENTER_KEYCODE = 13;
    const SPACE_BAR_KEYCODE = 32;
    
    class GameView {
        
        constructor(foodChangeCallback, keyDownCallback, playerColorChangeCallback, playerNameUpdatedCallback, speedChangeCallback) {
            this.isChangingName = false;
            this.foodChangeCallback = foodChangeCallback;
            this.keyDownCallback = keyDownCallback;
            this.playerColorChangeCallback = playerColorChangeCallback;
            this.playerNameUpdatedCallback = playerNameUpdatedCallback;
            this.speedChangeCallback = speedChangeCallback;
            this._setUpEventHandling();
        }
        
        ready() {
            // Show everything when ready
            DomHelper.getCoverDiv().style.visibility = "visible";
        }

        showFoodAmount(foodAmount) {
            DomHelper.getCurrentFoodAmountLabel().innerHTML = foodAmount;
        }
        
        showNotification(notification, playerColor) {
            let notificationDiv = DomHelper.getNotificationsDiv();
            let formattedNotification = "<div><span class='timelabel'>" + new Date().toLocaleTimeString() + " -</span> <span style='color:" + playerColor + "'>" + notification + "<span/></div>";
            notificationDiv.innerHTML = formattedNotification + notificationDiv.innerHTML;
        }
        
        showPlayerStats(playerStats) {
            let formattedScores = "<div class='playerStats'><span>Name</span><span>Score</span><span>High</span></div>";
            for( let playerStat of playerStats) {
                formattedScores+= "<div class='playerStats'><span style='color:"+playerStat.color+"'>" + playerStat.name + "</span>" +
                                  "<span>" + playerStat.score + "</span><span>" + playerStat.highScore + "</span></div>";
            }
            DomHelper.getPlayerStatsDiv().innerHTML = formattedScores;
        }
        
        showSpeed(speed) {
            DomHelper.getCurrentSpeedLabel().innerHTML = speed;
        }
        
        updatePlayerName(playerName, playerColor) {
            DomHelper.getPlayerNameElement().value = playerName;
            DomHelper.getPlayerNameElement().style.color = playerColor;
        }
        
        /*******************
         *  Event handling *
         *******************/
        
        _handleChangeColorButtonClick() {
            this.playerColorChangeCallback();
        }
        
        _handleChangeNameButtonClick() {
            if(this.isChangingName) {
                this._saveNewPlayerName();
            } else {
                DomHelper.getChangeNameButton().innerHTML = "Save";
                DomHelper.getPlayerNameElement().readOnly = false;
                DomHelper.getPlayerNameElement().select();
                this.isChangingName = true;
            }
        }
        
        _handleKeyDown(e) {
            // Prevent space bar scrolling default behavior
            if (e.keyCode === SPACE_BAR_KEYCODE && e.target == DomHelper.getBody()) {
                e.preventDefault();
            }
            
            // When changing names, save new name on enter
            if(e.keyCode === ENTER_KEYCODE && this.isChangingName) {
                this._saveNewPlayerName();
                DomHelper.blurActiveElement();
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
            let playerName = DomHelper.getPlayerNameElement().value;
            if(playerName && playerName.trim().length > 0 && playerName.length <= ClientConfig.MAX_NAME_LENGTH) {
                this.playerNameUpdatedCallback(playerName);
                DomHelper.getChangeNameButton().innerHTML = "Change Name";
                DomHelper.getPlayerNameElement().readOnly = true;
                this.isChangingName = false;
                DomHelper.getInvalidPlayerNameLabel().style.display = "none";
            } else {
                DomHelper.getInvalidPlayerNameLabel().style.display = "inline";
            }
        }
        
        _setUpEventHandling() {
            DomHelper.getChangeColorButton().addEventListener("click", this._handleChangeColorButtonClick.bind(this), false);
            DomHelper.getChangeNameButton().addEventListener("click", this._handleChangeNameButtonClick.bind(this), false);
            DomHelper.getIncreaseSpeedButton().addEventListener("click", this._handleIncreaseSpeedButtonClick.bind(this), false);
            DomHelper.getDecreaseSpeedButton().addEventListener("click", this._handleDecreaseSpeedButtonClick.bind(this), false);
            DomHelper.getResetSpeedButton().addEventListener("click", this._handleResetSpeedButtonClick.bind(this), false);
            DomHelper.getIncreaseFoodButton().addEventListener("click", this._handleIncreaseFoodButtonClick.bind(this), false);
            DomHelper.getDecreaseFoodButton().addEventListener("click", this._handleDecreaseFoodButtonClick.bind(this), false);
            DomHelper.getResetFoodButton().addEventListener("click", this._handleResetFoodButtonClick.bind(this), false);
            window.addEventListener( "keydown", this._handleKeyDown.bind(this), true);
        }
    }

    return GameView;

});     