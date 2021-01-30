/**
 * Created by Oakley Hall on 6/23/15.
 */

module.exports = function(){
  const pi = Math.PI;
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const player = this._player();
  const score = this._score;
  const ai = this._ai();
  const that = this;
  const r = Math.random();

  return {
    serve(side){
      const phi = 0.1*pi*(1 - 2*r);
      that.setState({
        ballx: side === 1 ? state.playerx + state.paddleWidth : state.aix - state.ballSize,
        bally: (props.height - state.ballSize) * r,
        velx: state.ballSpeed * Math.cos(phi) * side,
        vely: state.ballSpeed * Math.sin(phi)
      });
    },
    update() {
      const bx = state.ballx;
      const by = state.bally;
      const vx = state.velx;
      const vy = state.vely;

      that.setState({
        ballx: bx + vx,
        bally: by + vy
      });

      if (0 > by || by + state.ballSize > props.height) {
        const offset = state.vely < 0 ? 0 - state.bally : props.height - (state.bally+state.ballSize);
        that.setState({
          bally: by + 2 * offset,
          vely: vy * -1
        });
      }

      const pdle = state.velx < 0 ? player : ai;

      const AABBIntersect = (paddleX, paddleY, pWidth, pHeight, bx, by, bw, bh) => {
        return paddleX < bx + bw &&
          paddleY < by + bh &&
          bx < paddleX + pWidth &&
          by < paddleY + pHeight;
      };
      if (AABBIntersect(pdle.position().x, pdle.position().y, state.paddleWidth, state.paddleHeight,
          state.ballx, state.bally, state.ballSize, state.ballSize)) {

        const dir = state.velx < 0 ? 1 : -1;
        const n = ( state.bally + state.ballSize - pdle.position().y )/( state.paddleHeight + state.ballSize );
        const ydir = ( n > 0.5 ? -1 : 1 ) * dir;
        const phi = (0.25 * pi) * ( 2 * n + dir ) + r;
        // const smash = Math.abs(phi) > 0.2 * pi ? 1.1 : 1;

        that.setState({
          ballx: pdle === player ?
          state.playerx + state.paddleWidth : state.aix - state.ballSize,
          velx: -1 * state.velx,
          vely: ydir * state.velx * Math.sin(phi)
        });
      }

      if (0 > state.ballx + state.ballSize || state.ballx > props.width) {
        score(pdle.name());
        this.serve( pdle.name() === player.name() ? 1 : -1);
      }
    },
    draw(){
      context.beginPath();
      context.arc(state.ballx, state.bally, state.ballSize, 0, 2 * Math.PI);
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = '#fff';
      context.stroke();
    }
  };
};