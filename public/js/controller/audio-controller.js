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

    toggleMute() {
        this.isMuted = !this.isMuted;
    }
}
