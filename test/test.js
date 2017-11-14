var assert = require("assert");
describe("game", () => {
    describe("#togglePower()", () => {
        it("Should switch power to true if it is fale and visa versa", () => {
            assert.equal(false, game.power);
            game.togglePower();
            assert.equal(true, game.power);
            game.togglePower();
            assert.equal(false, game.power);
        });
    });
});
