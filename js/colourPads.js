let colours = ['red', 'blue', 'yellow', 'green'];
let lights = {};

function init() {
    for (let i = 0; i < 4; i++) {
        let light = document.getElementById(colours[i]);
        lights[colours[i]] = light;
    }
    console.log(lights);
}

function flash(colour, duration) {
    let el = lights[colour];
    el.classList.add(colour + 'ButtonFlash');
    setTimeout(() => {
        el.classList.remove(colour + 'ButtonFlash');
        el.classList.add(colour + 'Button');
    }, duration);
}


module.exports = {
    flash,
    init
};
