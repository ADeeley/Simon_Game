let lights = {};

function flash(colour) {
    let el = document.getElementById(colour).style;
    let prevClr = el['background-color'];
    el['background-color'] = 'white';
    setTimeout(() => {
        el['background-color'] = prevClr;
    }, 1000);
}

module.exports = {
    flash,
};
