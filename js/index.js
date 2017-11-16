var game = {
    colours : ["red", "blue", "yellow", "green"],
    pattern : [],
    userPattern : [],
    listening : false,
    strict: false,
    power: false,
    red : document.getElementById("red"),
    blue : document.getElementById("blue"),
    yellow : document.getElementById("yellow"),
    green : document.getElementById("green")
}

game.init = function() {
    game.incrementPattern();
    game.uiBind();
}

game.uiBind = function() {
    game.red.addEventListener("click", () => {
        game.playerInput(event.target.id);
    });
    game.blue.addEventListener("click", () => {
        game.playerInput(event.target.id);
    });
    game.yellow.addEventListener("click", () => {
        game.playerInput(event.target.id);
    });
    game.green.addEventListener("click", () => {
        game.playerInput(event.target.id);
    });
}
game.flash = function(colour) {
    switch(colour) {
        case "red":
            game.red.innerHTML = "!";
            setTimeout(() => {
                game.red.innerHTML = "RED";
            }, 1000);
            break;
        case "blue":
            game.blue.innerHTML = "!";
            setTimeout(() => {
                game.blue.innerHTML = "BLUE";
            }, 1000);
            break;
        case "yellow":
            game.yellow.innerHTML = "!";
            setTimeout(() => {
                game.yellow.innerHTML = "yellow";
            }, 1000);
            break;
        case "green":
            game.green.innerHTML = "!";
            setTimeout(() => {
                game.green.innerHTML = "green";
            }, 1000);
            break;
    }
}

game.togglePower = function() {
    game.power = !game.power;
}

game.toggleStrictMode = function() {
    game.strict = !game.strict;
}

game.reset = function() {
    game.pattern = [];
}

game.incrementPattern = function() {
    var choice = Math.floor(Math.random()*4);
    game.pattern.push(game.colours[choice]);
}

game.playPattern = function() {
    var i = 0;
    var intervalID = setInterval(() => {
        game.flash(game.pattern[i++]);
        if (i >= game.pattern.length) {
            clearInterval(intervalID);
        }
    }, 1000);
    console.log(game.pattern);
    game.listenForPlayerInput();
}

game.patternsMatch = function() {
    for (var i=0; i<game.userPattern.length; i++) {
        if (game.userPattern[i] != game.pattern[i]) {
            return false;
        }
    }
    return true;
}
game.playerInput = function(colour) {
    if (!game.listening) {
        return;
    }

    game.userPattern.push(colour);

    console.log(game.userPattern);
    console.log(game.userPattern.length + " " + game.pattern.length); 
    if (game.userPattern.length != game.pattern.length) {
        return;
    }
    if (!game.patternsMatch()) {
        console.log("Failed");
    }
    else {
        console.log("Match");
        game.userPattern = [];
        game.incrementPattern();
        game.playPattern();
    }
}

game.listenForPlayerInput = function() {
    game.listening = true;
}

game.init();
game.playPattern();
