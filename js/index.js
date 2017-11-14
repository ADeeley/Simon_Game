var game = {
    colours : ["R", "B", "Y", "G"],
    pattern : [],
    strict: false,
    power: false,

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

game.playSequence = function() {
    var i = 0;
    var intervalID = setInterval(() => {
        console.log(game.pattern[i++]);
        if (i >= game.pattern.length) {
            clearInterval(intervalID);
        }
    }, 1000);
}

game.listenForPlayerInput = function() {
    //      player arr = [];
    //
    //      if length of arr == 20
    //          playVictorySound()
    //          playVictorySequence()
    //          reset();
    //      
    //      listen for input: 
    //
    //      if error 
    //          playErrorSound
    //          playErrorSequence
    //          if strict
    //                  reset()
    //          else
    //                  playSequence()
    //      else
    //          add to array
    //
    //
    //      if length of ar is same as game.sequence:
    //          playCorrectSound()
    //          playCorrectSequence()
    //          incrementSequence()
    //
    //
    //
    //
    //          

}

// Increment pattern Test
console.log(game.pattern);
for (var i=0; i<20; i++) {
    game.incrementPattern();
}
console.log(game.pattern);

//playSequence Test
game.playSequence();
