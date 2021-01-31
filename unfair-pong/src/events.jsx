module.exports = function () {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    const that = this;

    return {
        randomEvent() {
            const eventID = Math.floor(Math.random() * ((state.difficulty + 1) * 2))
            console.log("Chose event: ", eventID, "\n")
            var name
            switch(eventID) {
                case 0:
                    name = "Faster Ball"
                    that.setState({
                        ballSpeed: state.ballSpeed + 0.5
                    })
                    window.alert(name)
                    break;
                
                case 1:
                    name = "Faster Paddles"
                    that.setState({
                        paddleSpeed: state.paddleSpeed * 2
                    })
                    window.alert(name)
                    break;

                case 2:
                    name = "Ad Time!"
                    // Do ad thing here
                    window.alert(name)
                    break;

                case 3:
                    name = "Confused?"
                    const temp = state.upArrow
                    this.setState({
                        upArrow: state.downArrow,
                        downArrow: temp
                    })
                    window.alert(name)
                    break;

                case 4:
                    name = "So Tired"
                    this.setState({
                        paddleSpeed: state.paddleSpeed * 0.75
                    })
                    window.alert(name)
                    break;

                case 5:
                    name = "3D"
                    this.setState({
                        enable3D: true
                    })
                    window.alert(name)
                    break;
            }
            console.log(name)
        }
    };
};
