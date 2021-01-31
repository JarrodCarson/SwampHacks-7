module.exports = function () {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    const that = this;

    return {
        randomEvent() {
            console.log("event triggered!");
        }
    };
};