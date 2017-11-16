var Game = {
    colours : ["red", "blue", "yellow", "green"],
    pattern : [],
    userPattern : [],
    listening : false,
    strict: false,
    power: false,
    colourButtons : document.getElementById("colourButtons"),
    strictCheckbox : document.getElementById("strictToggle"),
    start : document.getElementById("start"),
    reset : document.getElementById("reset"),
    power : document.getElementById("power")

}

Game.init = function() {
    Game.incrementPattern();
    Game.uiBind();
}

Game.uiBind = function() {
    Game.colourButtons.addEventListener("click", () => {
        Game.playerInput(event.target.id);
    });
}

Game.togglePower = function() {
    Game.power = !Game.power;
}

Game.toggleListenForPlayerInput = function() {
    Game.listening = !Game.listening;
}

Game.toggleStrictMode = function() {
    Game.strict = !Game.strict;
}

Game.flash = function(colour) {
    console.log("Flash: " + colour);
    var el = document.getElementById(colour);
    var temp = el.innerHTML;
    el.innerHTML = "!";
    setTimeout(() => {
        el.innerHTML = colour;
    }, 1000);
}

Game.reset = function() {
    Game.pattern = [];
    Game.userPattern = [];
    Game.listening = false;
}

Game.incrementPattern = function() {
    var choice = Math.floor(Math.random()*4);
    Game.pattern.push(Game.colours[choice]);
}

Game.playPattern = function(i=0) {
    Game.flash(Game.pattern[i++]);
    if (i < Game.pattern.length) {
        return setTimeout(() => {
            Game.playPattern(i)
        }, 1000);
    }

    Game.toggleListenForPlayerInput();
}

Game.patternsMatch = function() {
    for (var i=0; i<Game.userPattern.length; i++) {
        if (Game.userPattern[i] != Game.pattern[i]) {
            return false;
        }
    }
    return true;
}
Game.playerInput = function(colour) {
    // Prevent this function processing whilst other actions are 
    // being performed
    if (!Game.listening) {
        return;
    }

    Game.userPattern.push(colour);

    console.log(Game.userPattern);
    console.log(Game.userPattern.length + " " + Game.pattern.length); 
    // Only proceed with checking if the arrays are of the same length
    if (Game.userPattern.length != Game.pattern.length) {
        return;
    }
    if (!Game.patternsMatch()) {
        console.log("Failed");
    }
    else {
        console.log("Match");
        Game.userPattern = [];
        Game.toggleListenForPlayerInput();
        Game.incrementPattern();
        Game.playPattern();
    }
}

Game.init();
Game.playPattern();
