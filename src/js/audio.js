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
    sounds[colour].play();
}

module.exports = {
    playAudio,
    init,
};
