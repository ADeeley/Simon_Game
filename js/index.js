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
const Game = {
	colours: ['red', 'blue', 'yellow', 'green'],
	pattern: [],
	userPattern: [],
	listening: false,
	strict: false,
	power: false,
	colourButtons: document.getElementById('colourButtons'),
	strictCheckbox: document.getElementById('strictToggle'),
	start: document.getElementById('start'),
	reset: document.getElementById('reset'),
	powerButton: document.getElementById('power')
};
/**
 * Sets up the function for play. Must be called first.
 *
 * @return null
 */
Game.init = function() {
	Game.uiBind();
};
/**
 * Serves to keep the DOM references separate from the logic.
 * 
 * @return null
 */
Game.uiBind = function() {
	Game.colourButtons.addEventListener('click', () => {
		Game.getPlayerInput(event.target.id);
	});
	Game.start.addEventListener('click', () => {
                console.log("Start");
                Game.play();
	});
	Game.powerButton.addEventListener('click', () => {
                Game.togglePower();
	});
};
/**
 * Turns the game on and off
 *
 * @return null
 */
Game.togglePower = function() {
	Game.power = !Game.power;
        console.log(Game.power);
};
/**
 * Starts the game and plays the first pattern
 *
 * @return null
 */
Game.play = function() {
        if (!Game.power) {
                console.log("Power not on.");
                return
        }
	Game.incrementPattern();
        Game.playPattern();
};
/**
 * A switch to prevent the game from interpreting user clicks when not required
 * 
 * @return null
 */
Game.toggleListenForPlayerInput = function() {
	Game.listening = !Game.listening;
};
/**
 * Switches the game to the one-mistake-only version of the game.
 *
 * @return null
 */
Game.toggleStrictMode = function() {
	Game.strict = !Game.strict;
};
/**
 * Animates the current colour in the sequence.
 *
 * @return null
 */
Game.flash = function(colour) {
	console.log('Flash: ' + colour);
	let el = document.getElementById(colour);
	el.innerHTML = '!';
	setTimeout(() => {
		el.innerHTML = colour;
	}, 1000);
};
/**
 * Sets the Game object's parameters to their 'factory' settings
 *
 * @return null
 */
Game.reset = function() {
	Game.pattern = [];
	Game.userPattern = [];
	Game.listening = false;
};
/**
 * Adds another colour to the pattern that the user needs to copy
 *
 * @return null
 */
Game.incrementPattern = function() {
	let choice = Math.floor(Math.random() * 4);
	Game.pattern.push(Game.colours[choice]);
};
/**
 * Runs through the current pattern recursively, animating each colour in sequence.
 *
 * @param {Number} i used to keep track of numbers remaining in the pattern array
 * @return null
 */
Game.playPattern = function(i = 0) {
	Game.flash(Game.pattern[i++]);
	if (i < Game.pattern.length) {
		return setTimeout(() => {
			Game.playPattern(i);
		}, 1000);
	}
	Game.toggleListenForPlayerInput();
};
/**
 * Checks if the pattern inputted by the player matches the generated pattern
 *
 * @return {Boolean} The decision as to if the strings match
 */
Game.patternsMatch = function() {
	for (let i = 0; i < Game.userPattern.length; i++) {
		if (Game.userPattern[i] != Game.pattern[i]) {
			return false;
		}
	}
	return true;
};
/**
 * Adds the player input to the userPattern parameter and passes control to the process inputfunction
 *
 * @param {String} colour The colour which the player has inputted.
 * @return null
 */
Game.getPlayerInput = function(colour) {
	// Prevent this function processing whilst other actions are 
	// being performed
	if (!Game.listening) {
		return;
	}

	Game.userPattern.push(colour);
        Game.processInput();
};
/**
 * The main logic for the game - decides if the player input is correct and which 
 * path to take
 *
 * @return null
 */
Game.processInput = function() {
        let match = false
	if (!Game.patternsMatch()) {
                console.log('Failed');
                Game.reset();
                return;
        } else {
                match = true;
        }

	if (Game.userPattern.length != Game.pattern.length) {
		return;
        } else {
            if (match)
		console.log('Match');
		Game.userPattern = [];
		Game.toggleListenForPlayerInput();
		Game.incrementPattern();
		Game.playPattern();
	}
};
Game.init();
