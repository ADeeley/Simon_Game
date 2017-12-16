(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let sounds = {};
let colours = ['red', 'blue', 'yellow', 'green'];

function init() {
    // TO DO: BY tag name, then batch assign
    for (let i = 0; i < 4; i++) {
        let sound = document.getElementById('simonSound' + i);
        sounds[colours[i]] = sound;
    }
}

function playAudio(colour) {
    console.log('playAudio: ' + colour);
    sounds[colour].play();
}

module.exports = {
    playAudio,
    init,
};

},{}],2:[function(require,module,exports){
let colours = ['red', 'blue', 'yellow', 'green'];
let lights = {};

function init() {
    for (let i = 0; i < 4; i++) {
        let light = document.getElementById(colours[i]);
        lights[colours[i]] = light;
    }
    console.log(lights);
}

function flash(colour) {
    let el = lights[colour].style;
    let prevClr = el['background-color'];
    el['background-color'] = 'white';
    setTimeout(() => {
        el['background-color'] = prevClr;
    }, 1000);
}

module.exports = {
    flash,
    init
};

},{}],3:[function(require,module,exports){
/**
 * Salmon Says Application
 * 
 * @module Salmon Says App 
 */
'use strict';

const AUDIO = require('./audio.js');
const COLOURPADS = require('./colourPads.js');
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
        listening = false,
        strict = false,
        power = false,
        alertText = document.getElementById('alertText');

    // ======================================================================
    // Privileged Methods ===================================================
    // ======================================================================
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
        console.log('playPattern ' + cpuPattern);
        COLOURPADS.flash(colour);
        AUDIO.playAudio(colour);
        if (i < cpuPattern.length) {
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
        document.getElementById('colourButtons').addEventListener('click', () => {
            if (cpuPattern.length === 0) {return;}
            if (event.target.tagName !== 'div') {
                getPlayerInput(event.target.id);
            }
        });
        document.getElementById('start').addEventListener('click', () => {
            console.log('Start');
            play();
        });
        document.getElementById('power').addEventListener('click', () => {
            togglePower();
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
        console.log('clicked ' + colour);

        if (!Game.isListening) {
            return;
        }
        Game.recordUserInput(colour);
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
    console.log('Processing Input...');
    if (!Game.patternsMatch()) {
        if (Game.isStrict()) {
            console.log('Strict: ' + Game.isStrict());
            Game.displayAlert('Strict Failed');
            Game.reset();
            Game.toggleListenForPlayerInput();
            return;
        } else {
            Game.displayAlert('Try Again');
            Game.repeatPattern();
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
        Game.incrementPattern();
        Game.repeatPattern();
    }
};
window.onload = Game.init();

},{"./audio.js":1,"./colourPads.js":2}]},{},[3]);