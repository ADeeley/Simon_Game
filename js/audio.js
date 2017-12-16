let sounds = {};
let colours = ['red', 'blue', 'yellow', 'green'];

function getAudioSources() {
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
    getAudioSources,
    playAudio,
};
