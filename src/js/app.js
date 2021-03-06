'use strict';
import '../css/style.css';
import AUDIO from './audio.js';
import COLOURPADS from './colourPads.js';

/**
 * The object containing the game logic and interactions with the DOM
 *
 * @namespace Game
 * @class Game
 */
const Game = ( function() {
    // members ===================================================
    var colours = ['red', 'blue', 'yellow', 'green'],
        cpuPattern = [],
        userPattern = [],
        listening = true,
        strict = false,
        power = false,
        alertText = document.getElementById('alertText'),
        powerLight = document.getElementById('powerLight');


    // ======================================================================
    // Privileged Methods ===================================================
    // ======================================================================
    function _togglePowerLight() {
        if (powerLight.classList.contains('lightOff')) {
            powerLight.classList.remove('lightOff');
            powerLight.classList.add('lightOn');
        } else {
            powerLight.classList.remove('lightOn');
            powerLight.classList.add('lightOff');
        }
    }
    /**
     * Turns the game on and off
     *
     * @return null
     */
    function togglePower() {
        power = !power;
        _togglePowerLight();
        return this;
    }
    /**
     * Getter for power.
     *
     * @return {Boolean} The current power state
     */
    function isPoweredOn() {
        return power;
    }
    /**
     * A switch to prevent the game from interpreting user clicks when not required
     * 
     * @return null
     */
    function toggleListenForPlayerInput() {
        listening = !listening;
        return this;
    }
    /**
     * Getter method for listening.
     * 
     * @return {Boolean} If the game is ready for input. 
     */
    function isListening() {
        // is this private?
        return listening;
    }
    /**
     * Pushes the user input to the userPattern property
     *
     * @return null
     */
    function recordUserInput(colour) {
        userPattern.push(colour);
        return this;
    }
    /**
     * Switches the game to the one-mistake-only version of the game.
     *
     * @return null
     */
    function toggleStrictMode() {
        strict = !strict;
        console.log(strict);
        return this;
    }
    /**
     * Getter method for strict mode state.
     * 
     * @return {Boolean} If the game is in strict mode or not.
     */
    function isStrict() {
        // is this private?
        return strict;
    }
    /**
     * Adds another colour to the pattern that the user needs to copy
     *
     * @return null
     */
    function incrementPattern() {
        let choice = Math.floor(Math.random() * 4);
        cpuPattern.push(colours[choice]);
        return this;
    }
    /**
     * Resets the user input to a blank array.
     *
     * @return null
     */
    function clearUserPattern() {
        userPattern = [];
        return this;
    }
    /**
     * Runs through the current pattern recursively, animating each colour in sequence.
     *
     * @param {Number} i used to keep track of numbers remaining in the pattern array
     * @return null
     */
    function playPattern(i = 0) {
        let colour = cpuPattern[i++];
        COLOURPADS.flash(colour, 1000);
        AUDIO.playAudio(colour);

        if (i < cpuPattern.length) {
            return setTimeout(() => {
                playPattern(i);
                if (i == cpuPattern.length -1) {
                    toggleListenForPlayerInput();
                    setTimeout(() => displayAlert('READY'), 1000);
                }
            }, 1000);
        } 
        if (cpuPattern.length === 1) {
            setTimeout(() => displayAlert('READY'), 1000);
        }
    }
    /**
     * Checks if the pattern inputted by the player matches the generated pattern
     *
     * @return {Boolean} The decision as to if the strings match
     */
    function patternsMatch() {
        for (let i = 0; i < userPattern.length; i++) {
            if (userPattern[i] != cpuPattern[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns true if the userPattern and pattern are of the same length
     *
     * @return {Boolean} result of length test
     */
    function patternsAreOfEqualLength() {
        return cpuPattern.length === userPattern.length;
    }
    /**
     * Displays a message to the user - e.g. "Fail" and resets the alertMessage to "" after
     * 1 second.
     *
     * @param {String} message the string to display to the user
     * @return null
     */
    function displayAlert(message) {
        alertText.innerHTML = message;
        /*
        setTimeout( () => {
            alertText.innerHTML = 'READY';
        }, 1000);
        */
    }
    /**
     * Starts the game and plays the first pattern
     *
     * @return null
     */
    function play() {
        if (!isPoweredOn()) {
            return;
        }
        incrementPattern();
        playPattern();
    }
    /**
     * Sets the Game object's parameters to their 'factory' settings.
     *
     * @return null
     */
    function reset() {
        cpuPattern = [];
        userPattern = [];
        return this;
    }
    function init() {
        AUDIO.init();
        COLOURPADS.init();
        document.getElementById('colourButtons')
            .addEventListener('mousedown', function (event) {
                if (!event) event = window.event;
                if (cpuPattern.length === 0 || !listening) {return;}
                if (event.target.tagName !== 'div') {
                    getPlayerInput(event.target.id);
                }
            });
        document.getElementById('start').addEventListener('click', () => {
            displayAlert('WAIT');
            play();
        });
        document.getElementById('power').addEventListener('click', () => {
            togglePower();
            if (power) {
                displayAlert('READY');
            } else {
                displayAlert('--------');
            }
        });
        document.getElementById('strictToggle').addEventListener('click', () => {
            toggleStrictMode();
        });
        document.getElementById('reset').addEventListener('click', () => {
            reset();
        });
    }

    /**
     * Adds the player input to the userPattern parameter and passes control to the process inputfunction
     *
     * @param {String} colour The colour which the player has inputted.
     * @return null
     */
    function getPlayerInput(colour) {
        // Prevent this function processing whilst other actions are 
        // being performed
        if (!isListening) {
            console.log('lalala - not listening!')
            return;
        }
        recordUserInput(colour);
        //COLOURPADS.flash(colour, 250);
        AUDIO.playAudio(colour);
        Game.processInput();
    }

    // Revealing module pattern ===========================================
    return {
        togglePower,
        isPoweredOn,
        toggleListenForPlayerInput,
        isListening,
        recordUserInput,
        toggleStrictMode,
        isStrict,
        incrementPattern,
        playPattern,
        patternsMatch,
        patternsAreOfEqualLength,
        clearUserPattern,
        getPlayerInput,
        displayAlert,
        play,
        reset,
        init,
    };
})();
Game.repeatPattern = function() {
    Game.clearUserPattern();
    setTimeout(() => {
        Game.toggleListenForPlayerInput();
        Game.displayAlert('WAIT');
        Game.playPattern();
    }, 1000);
};
/**
 * The main logic for the game - decides if the player input is correct and which 
 * path to take
 *
 * @return null
 */
Game.processInput = function() {
    if (!Game.patternsMatch()) {
        if (Game.isStrict()) {
            Game.displayAlert('FAILED');
            Game.reset();
            Game.toggleListenForPlayerInput();
            return;
        } else {
            Game.displayAlert('WRONG');
            Game.repeatPattern();
            return;
        }
    }
    // Only proceed if the user has inputted a whole pattern
    if (!Game.patternsAreOfEqualLength()) {
        return;
    } else {
        Game.displayAlert('MATCH');
        Game.incrementPattern();
        Game.repeatPattern();
    }
};
window.onload = Game.init();
