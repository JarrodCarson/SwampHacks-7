/**
 * Created by Oakley Hall on 6/23/15.
 */
module.exports = function(){
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const keystate = this._keystate;
  const that = this;
  let py;

  return {
    update() {
      py = state.playery;
      if (keystate[state.upArrow]){
        py = state.playery - state.paddleSpeed;
        that.setState({playery: py});
      }
      if (keystate[state.downArrow]){
        py = state.playery + state.paddleSpeed;
        that.setState({playery: py});
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - state.paddleHeight), 0);
      that.setState({playery: py});

    },
    draw(){
      context.fillRect(state.playerx, state.playery,
        state.paddleWidth, state.paddleHeight);
    },
    name(){
      return 'player';
    },
    position(y){
      if(y) {
        that.setState({playery: y});
      }
      return{
        x: state.playerx,
        y: state.playery
      }
    }
  };
};