import DomHelper from '../view/dom-helper.js';
/**
 * Controls all audio logic
 */
export default class AudioController {
    constructor() {
        this.isMuted = false;
        this.deathSound = new Audio('assets/death.wav');
        this.killSound = new Audio('assets/kill.wav');
        this.foodCollectedSound = new Audio('assets/food-consumed.wav');
        this.swapSound = new Audio('assets/swap.wav');
        DomHelper.getVolumeSlider().addEventListener('input', this.updateVolume.bind(this));
    }

    playDeathSound() {
        if (!this.isMuted) {
            this.deathSound.play();
        }
    }

    playFoodCollectedSound() {
        if (!this.isMuted) {
            this.foodCollectedSound.play();
        }
    }

    playKillSound() {
        if (!this.isMuted) {
            this.killSound.play();
        }
    }

    playSwapSound() {
        if (!this.isMuted) {
            this.swapSound.play();
        }
    }

    updateVolume() {
        const volume = DomHelper.getVolumeSlider().value;
        this.deathSound.volume = volume;
        this.foodCollectedSound.volume = volume;
        this.killSound.volume = volume;
        this.swapSound.volume = volume;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }
}
