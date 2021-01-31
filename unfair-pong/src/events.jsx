module.exports = function () {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    const that = this;

    return {
        randomEvent() {
            const eventID = Math.floor(Math.random() * (this.state.difficulty * 3))
            console.log("Chose event: ", eventID, "\n")
        }
    };
};