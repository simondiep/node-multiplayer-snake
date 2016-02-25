define([
    "config/client-config",
    "view/dom-helper"
],

function (ClientConfig, DomHelper) {
    "use strict";
    
    const ENTER_KEYCODE = 13;
    const SPACE_BAR_KEYCODE = 32;
    
    class GameView {
        
        constructor(backgroundImageUploadCallback, botChangeCallback, foodChangeCallback, imageUploadCallback, joinGameCallback, keyDownCallback, playerColorChangeCallback, playerNameUpdatedCallback, spectateGameCallback, speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback) {
            this.isChangingName = false;
            this.backgroundImageUploadCallback = backgroundImageUploadCallback;
            this.botChangeCallback = botChangeCallback;
            this.foodChangeCallback = foodChangeCallback;
            this.imageUploadCallback = imageUploadCallback;
            this.joinGameCallback = joinGameCallback;
            this.keyDownCallback = keyDownCallback;
            this.playerColorChangeCallback = playerColorChangeCallback;
            this.playerNameUpdatedCallback = playerNameUpdatedCallback;
            this.spectateGameCallback = spectateGameCallback;
            this.speedChangeCallback = speedChangeCallback;
            this.startLengthChangeCallback = startLengthChangeCallback;
            this.toggleGridLinesCallback = toggleGridLinesCallback;
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
        
        showNumberOfBots(numberOfBots) {
            DomHelper.getCurrentNumberOfBotsLabel().innerHTML = numberOfBots;
        }
        
        showPlayerStats(playerStats) {        
            let formattedScores = "<div class='playerStatsHeader'><span class='image'></span><span class='name'>Name</span><span class='stat'>Score</span><span class='stat'>High</span><span class='stat'>Kills</span><span class='stat'>Deaths</span></div>";
            for( let playerStat of playerStats) {
                let playerImageElement = "";
                if(playerStat.base64Image) {
                    playerImageElement = "<img src=" + playerStat.base64Image + " class='playerStatsImage'></img>" ;
                }
                formattedScores+= "<div class='playerStatsContent'><span class='image'>" + playerImageElement + "</span>" + 
                    "<span class='name' style='color:"+playerStat.color+"'>" + playerStat.name + "</span>" +
                    "<span class='stat'>" + playerStat.score + "</span>" + 
                    "<span class='stat'>" + playerStat.highScore + "</span>" + 
                    "<span class='stat'>"+ playerStat.kills +"</span>" + 
                    "<span class='stat'>"+ playerStat.deaths +"</span></div>";
            }
            DomHelper.getPlayerStatsDiv().innerHTML = formattedScores;
        }
        
        showSpeed(speed) {
            DomHelper.getCurrentSpeedLabel().innerHTML = speed;
        }
        
        showStartLength(startLength) {
            DomHelper.getCurrentStartLengthLabel().innerHTML = startLength;
        }
        
        updatePlayerName(playerName, playerColor) {
            DomHelper.getPlayerNameElement().value = playerName;
            if(playerColor) {
                DomHelper.getPlayerNameElement().style.color = playerColor;
            }
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
        
        _handleDecreaseBotsButtonClick() {
            this.botChangeCallback(ClientConfig.INCREMENT_CHANGE.DECREASE);
        }
        
        _handleIncreaseBotsButtonClick() {
            this.botChangeCallback(ClientConfig.INCREMENT_CHANGE.INCREASE);
        }
        
        _handleResetBotsButtonClick() {
            this.botChangeCallback(ClientConfig.INCREMENT_CHANGE.RESET);
        }
        
        _handleDecreaseFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.INCREMENT_CHANGE.DECREASE);
        }
        
        _handleIncreaseFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.INCREMENT_CHANGE.INCREASE);
        }
        
        _handleResetFoodButtonClick() {
            this.foodChangeCallback(ClientConfig.INCREMENT_CHANGE.RESET);
        }
        
        _handleDecreaseSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.INCREMENT_CHANGE.DECREASE);
        }
        
        _handleIncreaseSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.INCREMENT_CHANGE.INCREASE);
        }
        
        _handleResetSpeedButtonClick() {
            this.speedChangeCallback(ClientConfig.INCREMENT_CHANGE.RESET);
        }
        
        _handleDecreaseStartLengthButtonClick() {
            this.startLengthChangeCallback(ClientConfig.INCREMENT_CHANGE.DECREASE);
        }
        
        _handleIncreaseStartLengthButtonClick() {
            this.startLengthChangeCallback(ClientConfig.INCREMENT_CHANGE.INCREASE);
        }
        
        _handleResetStartLengthButtonClick() {
            this.startLengthChangeCallback(ClientConfig.INCREMENT_CHANGE.RESET);
        }
        
        _handleClearUploadedBackgroundImageButtonClick() {
            this.backgroundImageUploadCallback();
        }
        
        _handleClearUploadedImageButtonClick() {
            this.imageUploadCallback();
        }
        
        _handleBackgroundImageUpload() {
            let uploadedBackgroundImageAsFile = DomHelper.getBackgroundImageUploadElement().files[0];
            if(uploadedBackgroundImageAsFile) {
                // Convert file to image
                let image = new Image();
                let self = this;
                image.onload = function() {
                    self.backgroundImageUploadCallback(image, uploadedBackgroundImageAsFile.type);
                };
                image.src = URL.createObjectURL(uploadedBackgroundImageAsFile);
            }
        }
        
        _handleImageUpload() {
            let uploadedImageAsFile = DomHelper.getImageUploadElement().files[0];
            if(uploadedImageAsFile) {
                // Convert file to image
                let image = new Image();
                let self = this;
                image.onload = function() {
                    self.imageUploadCallback(image, uploadedImageAsFile.type);
                };
                image.src = URL.createObjectURL(uploadedImageAsFile);
            }
        }
        
        _handlePlayOrWatchButtonClick() {
            let command = DomHelper.getPlayOrWatchButton().textContent;
            if(command === "Play") {
                DomHelper.getPlayOrWatchButton().textContent = "Watch";
                this.joinGameCallback();
            } else {
                DomHelper.getPlayOrWatchButton().textContent = "Play";
                this.spectateGameCallback();
            }
        }
        
        _handleToggleGridLinesButtonClick() {
            this.toggleGridLinesCallback();
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
            DomHelper.getIncreaseBotsButton().addEventListener("click", this._handleIncreaseBotsButtonClick.bind(this), false);
            DomHelper.getDecreaseBotsButton().addEventListener("click", this._handleDecreaseBotsButtonClick.bind(this), false);
            DomHelper.getResetBotsButton().addEventListener("click", this._handleResetBotsButtonClick.bind(this), false);
            DomHelper.getIncreaseFoodButton().addEventListener("click", this._handleIncreaseFoodButtonClick.bind(this), false);
            DomHelper.getDecreaseFoodButton().addEventListener("click", this._handleDecreaseFoodButtonClick.bind(this), false);
            DomHelper.getResetFoodButton().addEventListener("click", this._handleResetFoodButtonClick.bind(this), false);
            DomHelper.getIncreaseSpeedButton().addEventListener("click", this._handleIncreaseSpeedButtonClick.bind(this), false);
            DomHelper.getDecreaseSpeedButton().addEventListener("click", this._handleDecreaseSpeedButtonClick.bind(this), false);
            DomHelper.getResetSpeedButton().addEventListener("click", this._handleResetSpeedButtonClick.bind(this), false);
            DomHelper.getIncreaseStartLengthButton().addEventListener("click", this._handleIncreaseStartLengthButtonClick.bind(this), false);
            DomHelper.getDecreaseStartLengthButton().addEventListener("click", this._handleDecreaseStartLengthButtonClick.bind(this), false);
            DomHelper.getResetStartLengthButton().addEventListener("click", this._handleResetStartLengthButtonClick.bind(this), false);
            DomHelper.getImageUploadElement().addEventListener("change", this._handleImageUpload.bind(this));
            DomHelper.getClearUploadedImageButton().addEventListener("click", this._handleClearUploadedImageButtonClick.bind(this));
            DomHelper.getBackgroundImageUploadElement().addEventListener("change", this._handleBackgroundImageUpload.bind(this));
            DomHelper.getClearUploadedBackgroundImageButton().addEventListener("click", this._handleClearUploadedBackgroundImageButtonClick.bind(this));
            DomHelper.getPlayOrWatchButton().addEventListener("click", this._handlePlayOrWatchButtonClick.bind(this), false);
            DomHelper.getToggleGridLinesButton().addEventListener("click", this._handleToggleGridLinesButtonClick.bind(this), false);
            DomHelper.getFullScreenButton().addEventListener("click", DomHelper.toggleFullScreenMode, false);
            window.addEventListener( "keydown", this._handleKeyDown.bind(this), true);
        }
    }

    return GameView;

});     