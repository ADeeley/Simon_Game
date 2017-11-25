/**
 * Salmon Says Application
 * 
 * @module Salmon Says App 
 */
'use strict';
/**
 * The object containing the game logic and interactions with the DOM
 *
 * @namespace Game
 * @class Game
 */
const Game = ( function() {
    // members ===================================================
    var colours = ['red', 'blue', 'yellow', 'green'],
        pattern = [],
        userPattern = [],
        listening = false,
        strict = false,
        power = false,
        alertText = document.getElementById('alertText');

    // Privileged Methods ===================================================
    /**
     * Turns the game on and off
     *
     * @return null
     */
    function togglePower() {
        power = !power;
        console.log('Power: ' + power);
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
        console.log('Listening: ' + listening);
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
     * Switches the game to the one-mistake-only version of the game.
     *
     * @return null
     */
    function toggleStrictMode() {
        strict = !strict;
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
     * Sets the Game object's parameters to their 'factory' settings.
     *
     * @return null
     */
    function reset() {
        pattern = [];
        userPattern = [];
        return this;
    }
    /**
     * Adds another colour to the pattern that the user needs to copy
     *
     * @return null
     */
    function incrementPattern() {
        let choice = Math.floor(Math.random() * 4);
        pattern.push(colours[choice]);
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
     * Animates the current colour in the sequence.
     *
     * @return null
     */
    function flash(colour) {
        let el = document.getElementById(colour);
        el.innerHTML = '!';
        setTimeout(() => {
            el.innerHTML = colour;
        }, 1000);
    }
    /**
     * Runs through the current pattern recursively, animating each colour in sequence.
     *
     * @param {Number} i used to keep track of numbers remaining in the pattern array
     * @return null
     */
    function playPattern(i = 0) {
        flash(pattern[i++]);
        if (i < pattern.length) {
            return setTimeout(() => {
                playPattern(i);
            }, 1000);
        } else toggleListenForPlayerInput();
        
    }
    /**
     * Checks if the pattern inputted by the player matches the generated pattern
     *
     * @return {Boolean} The decision as to if the strings match
     */
    function patternsMatch() {
        for (let i = 0; i < userPattern.length; i++) {
            if (userPattern[i] != pattern[i]) {
                return false;
            }
        }
        return true;
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
        setTimeout( () => {
            alertText.innerHTML = '';
        }, 1000);
    }
    /**
     * Starts the game and plays the first pattern
     *
     * @return null
     */
    function play() {
        if (!isPoweredOn()) {
            console.log('Power not on.');
            return;
        }
        incrementPattern();
        console.log('Test');
        playPattern();
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
     * Returns true if the userPattern and pattern are of the same length
     *
     * @return {Boolean} result of length test
     */
    function patternsAreOfEqualLength() {
        return pattern.length === userPattern.length;
    }
    // Revealing module pattern ===========================================
    return {
        togglePower: togglePower,
        isPoweredOn: isPoweredOn,
        toggleListenForPlayerInput: toggleListenForPlayerInput,
        toggleStrictMode: toggleStrictMode,
        reset: reset,
        incrementPattern: incrementPattern,
        playPattern: playPattern,
        patternsMatch: patternsMatch,
        displayAlert: displayAlert,
        isListening: isListening,
        play: play,
        recordUserInput: recordUserInput,
        patternsAreOfEqualLength: patternsAreOfEqualLength,
        isStrict: isStrict,
        clearUserPattern: clearUserPattern
    };
})();
/**
 * Adds the player input to the userPattern parameter and passes control to the process inputfunction
 *
 * @param {String} colour The colour which the player has inputted.
 * @return null
 */
Game.getPlayerInput = function(colour) {
    // Prevent this function processing whilst other actions are 
    // being performed
    console.log('clicked ' + colour);

    if (!Game.isListening) {
        return;
    }

    Game.recordUserInput(colour);
    Game.processInput();
};
/**
 * The main logic for the game - decides if the player input is correct and which 
 * path to take
 *
 * @return null
 */
Game.processInput = function() {
    console.log('Processing Input...');
    if (!Game.patternsMatch()) {
        if (Game.isStrict()) {
            console.log("Strict: " + Game.isStrict());
            Game.displayAlert('Strict Failed');
            Game.reset();
            Game.toggleListenForPlayerInput();
            return;
        } else {
            Game.displayAlert('Try Again');
            Game.clearUserPattern();
            Game.toggleListenForPlayerInput();
            Game.playPattern();
            return;
        }
    }

    // Only proceed if the user has inputted a whole pattern
    if (!Game.patternsAreOfEqualLength()) {
        console.log('not of equal len');
        return;
    } else {
        Game.displayAlert('Match');
        console.log('Match');
        Game.clearUserPattern();
        Game.toggleListenForPlayerInput();
        Game.incrementPattern();
        Game.playPattern();
    }
};

// One-time DOM event listener inits 
/**
 * Serves to keep the DOM references separate from the logic.
 * 
 * @return null
 */
document.getElementById('colourButtons').addEventListener('click', () => {
    Game.getPlayerInput(event.target.id);
});
document.getElementById('start').addEventListener('click', () => {
    console.log('Start');
    Game.play();
});
document.getElementById('power').addEventListener('click', () => {
    Game.togglePower();
});
document.getElementById('strictToggle').addEventListener('click', () => {
    Game.toggleStrictMode();
});
document.getElementById('reset').addEventListener('click', () => {
    Game.reset();
});