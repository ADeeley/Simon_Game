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
