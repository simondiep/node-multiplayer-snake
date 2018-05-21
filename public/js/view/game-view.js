import ClientConfig from '../config/client-config.js';
import DomHelper from './dom-helper.js';

const ENTER_KEYCODE = 13;
const SPACE_BAR_KEYCODE = 32;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;

/**
 * Handles all requests related to the display of the game, not including the canvas
 */
export default class GameView {
    constructor(backgroundImageUploadCallback, botChangeCallback, foodChangeCallback, imageUploadCallback,
        joinGameCallback, keyDownCallback, muteAudioCallback, playerColorChangeCallback, playerNameUpdatedCallback,
        spectateGameCallback, speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback) {
        this.isChangingName = false;
        this.backgroundImageUploadCallback = backgroundImageUploadCallback;
        this.imageUploadCallback = imageUploadCallback;
        this.joinGameCallback = joinGameCallback;
        this.keyDownCallback = keyDownCallback;
        this.muteAudioCallback = muteAudioCallback;
        this.playerNameUpdatedCallback = playerNameUpdatedCallback;
        this.spectateGameCallback = spectateGameCallback;
        this._initEventHandling(botChangeCallback, foodChangeCallback, muteAudioCallback, playerColorChangeCallback,
            speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback);
    }

    ready() {
        // Show everything when ready
        DomHelper.showAllContent();
    }

    setKillMessageWithTimer(message) {
        DomHelper.setKillMessagesDivText(message);
        if (this.killMessagesTimeout) {
            clearTimeout(this.killMessagesTimeout);
        }
        this.killMessagesTimeout = setTimeout(DomHelper.clearKillMessagesDivText.bind(DomHelper),
            ClientConfig.TIME_TO_SHOW_KILL_MESSAGE_IN_MS);
    }

    setMuteStatus(isMuted) {
        let text;
        if (isMuted) {
            text = 'Unmute';
        } else {
            text = 'Mute';
        }
        DomHelper.setToggleSoundButtonText(text);
    }

    showFoodAmount(foodAmount) {
        DomHelper.setCurrentFoodAmountLabelText(foodAmount);
    }

    showKillMessage(killerName, victimName, killerColor, victimColor, victimLength) {
        this.setKillMessageWithTimer(`<span style='color: ${killerColor}'>${killerName}</span> killed ` +
            `<span style='color: ${victimColor}'>${victimName}</span>` +
            ` and grew by <span style='color: ${killerColor}'>${victimLength}</span>`);
    }

    showKilledEachOtherMessage(victimSummaries) {
        let victims = '';
        for (const victimSummary of victimSummaries) {
            victims += `<span style='color: ${victimSummary.color}'>${victimSummary.name}</span> `;
        }
        this.setKillMessageWithTimer(`${victims} have killed each other`);
    }

    showRanIntoWallMessage(playerName, playerColor) {
        this.setKillMessageWithTimer(`<span style='color: ${playerColor}'>${playerName}</span> ran into a wall`);
    }

    showSuicideMessage(victimName, victimColor) {
        this.setKillMessageWithTimer(`<span style='color: ${victimColor}'>${victimName}</span> committed suicide`);
    }

    showNotification(notification, playerColor) {
        const notificationDiv = DomHelper.getNotificationsDiv();
        const formattedNotification = `<div><span class='time-label'>${new Date().toLocaleTimeString()} - </span>` +
            `<span style='color: ${playerColor}'>${notification}<span/></div>`;
        notificationDiv.innerHTML = formattedNotification + notificationDiv.innerHTML;
    }

    showNumberOfBots(numberOfBots) {
        DomHelper.setCurrentNumberOfBotsLabelText(numberOfBots);
    }

    showPlayerStats(playerStats) {
        let formattedScores = '<div class="player-stats-header"><span class="image"></span>' +
            '<span class="name">Name</span>' +
            '<span class="stat">Score</span>' +
            '<span class="stat">High</span>' +
            '<span class="stat">Kills</span>' +
            '<span class="stat">Deaths</span></div>';
        for (const playerStat of playerStats) {
            let playerImageElement = '';
            if (playerStat.base64Image) {
                playerImageElement = `<img src=${playerStat.base64Image} class='player-stats-image'></img>`;
            }
            formattedScores += `<div class='player-stats-content'><span class='image'>${playerImageElement}</span>` +
                `<span class='name' style='color: ${playerStat.color}'>${playerStat.name}</span>` +
                `<span class='stat'>${playerStat.score}</span>` +
                `<span class='stat'>${playerStat.highScore}</span>` +
                `<span class='stat'>${playerStat.kills}</span>` +
                `<span class='stat'>${playerStat.deaths}</span></div>`;
        }
        DomHelper.setPlayerStatsDivText(formattedScores);
    }

    showSpeed(speed) {
        DomHelper.setCurrentSpeedLabelText(speed);
    }

    showStartLength(startLength) {
        DomHelper.setCurrentStartLengthLabelText(startLength);
    }

    updatePlayerName(playerName, playerColor) {
        DomHelper.setPlayerNameElementValue(playerName);
        if (playerColor) {
            DomHelper.setPlayerNameElementColor(playerColor);
        }
    }

    /*******************
     *  Event handling *
     *******************/

    _handleChangeNameButtonClick() {
        if (this.isChangingName) {
            this._saveNewPlayerName();
        } else {
            DomHelper.setChangeNameButtonText('Save');
            DomHelper.setPlayerNameElementReadOnly(false);
            DomHelper.getPlayerNameElement().select();
            this.isChangingName = true;
        }
    }

    _handleKeyDown(e) {
        // Prevent keyboard scrolling default behavior
        if ((e.keyCode === UP_ARROW_KEYCODE || e.keyCode === DOWN_ARROW_KEYCODE) ||
             (e.keyCode === SPACE_BAR_KEYCODE && e.target === DomHelper.getBody())) {
            e.preventDefault();
        }

        // When changing names, save new name on enter
        if (e.keyCode === ENTER_KEYCODE && this.isChangingName) {
            this._saveNewPlayerName();
            DomHelper.blurActiveElement();
            return;
        }

        if (!this.isChangingName) {
            this.keyDownCallback(e.keyCode);
        }
    }

    _handleBackgroundImageUpload() {
        const uploadedBackgroundImageAsFile = DomHelper.getBackgroundImageUploadElement().files[0];
        if (uploadedBackgroundImageAsFile) {
            // Convert file to image
            const image = new Image();
            const self = this;
            image.onload = () => {
                self.backgroundImageUploadCallback(image, uploadedBackgroundImageAsFile.type);
            };
            image.src = URL.createObjectURL(uploadedBackgroundImageAsFile);
        }
    }

    _handleImageUpload() {
        const uploadedImageAsFile = DomHelper.getImageUploadElement().files[0];
        if (uploadedImageAsFile) {
            // Convert file to image
            const image = new Image();
            const self = this;
            image.onload = () => {
                self.imageUploadCallback(image, uploadedImageAsFile.type);
            };
            image.src = URL.createObjectURL(uploadedImageAsFile);
        }
    }

    _handlePlayOrWatchButtonClick() {
        const command = DomHelper.getPlayOrWatchButton().textContent;
        if (command === 'Play') {
            DomHelper.setPlayOrWatchButtonText('Watch');
            this.joinGameCallback();
        } else {
            DomHelper.setPlayOrWatchButtonText('Play');
            this.spectateGameCallback();
        }
    }

    _saveNewPlayerName() {
        const playerName = DomHelper.getPlayerNameElement().value;
        if (playerName && playerName.trim().length > 0 && playerName.length <= ClientConfig.MAX_NAME_LENGTH) {
            this.playerNameUpdatedCallback(playerName);
            DomHelper.setChangeNameButtonText('Change Name');
            DomHelper.setPlayerNameElementReadOnly(true);
            this.isChangingName = false;
            DomHelper.hideInvalidPlayerNameLabel();
        } else {
            DomHelper.showInvalidPlayerNameLabel();
        }
    }

    _initEventHandling(botChangeCallback, foodChangeCallback, muteAudioCallback, playerColorChangeCallback, speedChangeCallback,
        startLengthChangeCallback, toggleGridLinesCallback) {
        // Player controls
        DomHelper.getChangeColorButton().addEventListener('click', playerColorChangeCallback);
        DomHelper.getChangeNameButton().addEventListener('click', this._handleChangeNameButtonClick.bind(this));
        DomHelper.getPlayerNameElement().addEventListener('blur', this._saveNewPlayerName.bind(this));
        DomHelper.getImageUploadElement().addEventListener('change', this._handleImageUpload.bind(this));
        DomHelper.getClearUploadedImageButton().addEventListener('click', this.imageUploadCallback);
        DomHelper.getBackgroundImageUploadElement().addEventListener('change', this._handleBackgroundImageUpload.bind(this));
        DomHelper.getClearUploadedBackgroundImageButton().addEventListener('click', this.backgroundImageUploadCallback);
        DomHelper.getPlayOrWatchButton().addEventListener('click', this._handlePlayOrWatchButtonClick.bind(this));
        DomHelper.getToggleGridLinesButton().addEventListener('click', toggleGridLinesCallback);
        DomHelper.getToggleSoundButton().addEventListener('click', muteAudioCallback);
        DomHelper.getFullScreenButton().addEventListener('click', DomHelper.toggleFullScreenMode);
        window.addEventListener('keydown', this._handleKeyDown.bind(this), true);

        // Admin controls
        DomHelper.getIncreaseBotsButton().addEventListener('click',
            botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
        DomHelper.getDecreaseBotsButton().addEventListener('click',
            botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
        DomHelper.getResetBotsButton().addEventListener('click',
            botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
        DomHelper.getIncreaseFoodButton().addEventListener('click',
            foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
        DomHelper.getDecreaseFoodButton().addEventListener('click',
            foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
        DomHelper.getResetFoodButton().addEventListener('click',
            foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
        DomHelper.getIncreaseSpeedButton().addEventListener('click',
            speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
        DomHelper.getDecreaseSpeedButton().addEventListener('click',
            speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
        DomHelper.getResetSpeedButton().addEventListener('click',
            speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
        DomHelper.getIncreaseStartLengthButton().addEventListener('click',
            startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
        DomHelper.getDecreaseStartLengthButton().addEventListener('click',
            startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
        DomHelper.getResetStartLengthButton().addEventListener('click',
            startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
    }
}
