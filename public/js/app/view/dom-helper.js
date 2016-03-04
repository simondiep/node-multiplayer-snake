define(() => {
    'use strict';

    class DomHelper {

        static blurActiveElement() {
            document.activeElement.blur();
        }

        static createElement(elementName) {
            return document.createElement(elementName);
        }

        static getBackgroundImageUploadElement() {
            return document.getElementById('backgroundImageUpload');
        }

        static getBody() {
            return document.body;
        }

        static getClearUploadedBackgroundImageButton() {
            return document.getElementById('clearUploadedBackgroundImageButton');
        }

        static getClearUploadedImageButton() {
            return document.getElementById('clearUploadedImageButton');
        }

        static getChangeColorButton() {
            return document.getElementById('changePlayerColorButton');
        }

        static getChangeNameButton() {
            return document.getElementById('changePlayerNameButton');
        }

        static getDecreaseBotsButton() {
            return document.getElementById('decreaseBotsButton');
        }

        static getDecreaseFoodButton() {
            return document.getElementById('decreaseFoodButton');
        }

        static getDecreaseSpeedButton() {
            return document.getElementById('decreaseSpeedButton');
        }

        static getDecreaseStartLengthButton() {
            return document.getElementById('decreaseStartLengthButton');
        }

        static getFullScreenButton() {
            return document.getElementById('fullScreenButton');
        }

        static getGameBoardDiv() {
            return document.getElementById('gameBoard');
        }

        static getImageUploadElement() {
            return document.getElementById('imageUpload');
        }

        static getIncreaseBotsButton() {
            return document.getElementById('increaseBotsButton');
        }

        static getIncreaseFoodButton() {
            return document.getElementById('increaseFoodButton');
        }

        static getIncreaseSpeedButton() {
            return document.getElementById('increaseSpeedButton');
        }

        static getIncreaseStartLengthButton() {
            return document.getElementById('increaseStartLengthButton');
        }

        static getNotificationsDiv() {
            return document.getElementById('notifications');
        }

        static getPlayerNameElement() {
            return document.getElementById('playerName');
        }

        static getPlayOrWatchButton() {
            return document.getElementById('playOrWatchButton');
        }

        static getResetBotsButton() {
            return document.getElementById('resetBotsButton');
        }

        static getResetFoodButton() {
            return document.getElementById('resetFoodButton');
        }

        static getResetSpeedButton() {
            return document.getElementById('resetSpeedButton');
        }

        static getResetStartLengthButton() {
            return document.getElementById('resetStartLengthButton');
        }

        static getToggleGridLinesButton() {
            return document.getElementById('toggleGridLinesButton');
        }

        static hideInvalidPlayerNameLabel() {
            document.getElementById('invalidPlayerNameLabel').style.display = 'none';
        }

        static setChangeNameButtonText(text) {
            this.getChangeNameButton().innerHTML = text;
        }

        static setCurrentFoodAmountLabelText(text) {
            document.getElementById('currentFoodAmount').innerHTML = text;
        }

        static setCurrentNumberOfBotsLabelText(text) {
            document.getElementById('currentNumberOfBots').innerHTML = text;
        }

        static setCurrentSpeedLabelText(text) {
            document.getElementById('currentSpeed').innerHTML = text;
        }


        static setCurrentStartLengthLabelText(text) {
            document.getElementById('currentStartLength').innerHTML = text;
        }

        static setKillMessagesDivText(text) {
            document.getElementById('killMessages').innerHTML = text;
        }

        static setPlayerNameElementColor(color) {
            this.getPlayerNameElement().style.color = color;
        }

        static setPlayerNameElementReadOnly(readOnly) {
            this.getPlayerNameElement().readOnly = readOnly;
        }

        static setPlayerNameElementValue(value) {
            this.getPlayerNameElement().value = value;
        }

        static setPlayerStatsDivText(text) {
            document.getElementById('playerStats').innerHTML = text;
        }

        static setPlayOrWatchButtonText(text) {
            this.getPlayOrWatchButton().textContent = text;
        }

        static showAllContent() {
            document.getElementById('cover').style.visibility = 'visible';
        }

        static showInvalidPlayerNameLabel() {
            document.getElementById('invalidPlayerNameLabel').style.display = 'inline';
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
