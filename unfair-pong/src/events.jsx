module.exports = function () {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    const that = this;

    return {
        randomEvent() {
<<<<<<< HEAD
            const eventID = Math.floor(Math.random() * (this.state.difficulty * 3))
            console.log("Chose event: ", eventID, "\n")
=======
            console.log("event triggered!");
>>>>>>> e7aa69319c72cb6d8f3eb974b65abe9d7e42d536
        }
    };
};