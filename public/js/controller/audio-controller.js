/**
 * Controls all audio logic
 */
export default class AudioController {
    constructor() {
        this.isMuted = false;
        this.foodCollectedSound = new Audio('assets/food-consumed.wav');
    }

    playFoodCollectedSound() {
        if (!this.isMuted) {
            this.foodCollectedSound.play();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }
}
