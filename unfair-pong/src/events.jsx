module.exports = function () {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    const that = this;

    return {
        randomEvent() {
            const eventID = Math.floor(Math.random() * ((state.difficulty) * 2)) + 1
            var name = ""
            switch(eventID) {
                case 1:
                    name = "Faster Ball?"
                    that.setState({
                        smashMultiplier: state.smashMultiplier + 0.1
                    })
                    break;
                
                case 2:
                    name = "Faster Paddles"
                    that.setState({
                        paddleSpeed: state.paddleSpeed * 1.25
                    })
                    break;

                case 3:
                    

                case 4:
                    name = "Confused?"
                    const tempDir = state.upArrow
                    that.setState({
                        upArrow: state.downArrow,
                        downArrow: tempDir
                    })
                    break;

                case 5:
                    

                case 6:
                    name = "Random Ball Size"
                    that.setState({
                        randomSize: true
                    })
                    break;

                default:
                    name = state.mostRecentEvent
                    break;
            }
            console.log(name, eventID)
            that.setState({
                mostRecentEvent: name
            })
        }
    };
};
