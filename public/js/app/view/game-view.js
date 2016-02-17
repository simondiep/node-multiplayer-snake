define([
    "config/client-config"
],

function (ClientConfig) {
    "use strict";
    
    const ENTER_KEYCODE = 13;
    const SPACE_BAR_KEYCODE = 32;
    
    class GameView {
        
        constructor(keyDownCallback, playerNameUpdatedCallback) {
            this.keyDownCallback = keyDownCallback;
            this.playerNameUpdatedCallback = playerNameUpdatedCallback;
            this.isChangingName = false;
            this._getChangeNameButton().addEventListener('click', this._handleChangeNameButtonClick.bind(this), false);
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
        
        _getChangeNameButton() {
            return document.getElementById("changePlayerNameButton");
        }
        
        _getInvalidPlayerNameLabel() {
            return document.getElementById("invalidPlayerNameLabel");
        }
        
        _getPlayerNameElement() {
            return document.getElementById("playerName");
        }
        
        _handleChangeNameButtonClick(button) {
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