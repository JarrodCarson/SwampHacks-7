/**
 * Created by Oakley Hall on 6/19/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');

export default createReactClass({
  propTypes: {
    height: PropTypes.number,
    width: PropTypes.number,
    upArrow: PropTypes.number,
    downArrow: PropTypes.number,
    ballSize: PropTypes.number,
    paddleHeight: PropTypes.number,
    paddleWidth: PropTypes.number,
    paddleSpeed: PropTypes.number
  },
  getDefaultProps() {
    return {
      height: 700,
      width: 1400,
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 2.5,
      ballSize: 10
    }
  },
  getInitialState(){
    return {
      ballx: 100,
      bally: 100,
      ballSpeed: 1,
      velx: 0,
      vely: 0,
      aix: 1370,
      aiy: 100,
      playerx: 10,
      playery: 100,
      playerScore: 0
    }
  },
  componentDidMount: function() {
    this._setupCanvas();
    this._context.font = '40px Lucida Console';
    this._context.fillText('Welcome to:',
      this.props.width/2 - 120,
      this.props.height/2 - 40);
    this._context.fillText('UNFAIR PONG',
      this.props.width/2 - 120,
      this.props.height/2);

    setTimeout(this._startGame, 3000);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _ball: require('./ball'),
  _player: require('./player'),
  _ai: require('./ai'),
  _loop: null,
  _timer: null,
  _canvasStyle: {
    display: 'block',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0'
  },
  _startGame() {

    if(this._loop){
      return;
    }

    const keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      delete keystate[evt.keyCode];
    });
    document.addEventListener('ontouchstart', function(e) {e.preventDefault()}, false);
    document.addEventListener('ontouchmove', function(e) {e.preventDefault()}, false);

    this._loop = setInterval( () => {
      this._update();
      this._draw();
    },1);

    this._timer = setInterval( () => {
      const state = this.state;
      this.setState({
        ["playerScore"]: state["playerScore"] + 1
      });
    }, 1000);

    this._ball().serve(1);
  },
  _stopGame() {
    clearInterval(this._loop);
    clearInterval(this._timer);
    this._loop = null;
    this._timer = null;
    setTimeout(()=>{
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }, 0);

  },
  _setupCanvas: function() {
    this._canvas = ReactDOM.findDOMNode(this);
    this._context = this._canvas.getContext('2d');
  },
  _score(name) {
    const state = this.state;
    const scorer = {player: 'ai', ai: 'player'}[name];
    this.setState({
      [scorer+'Score']: state[scorer+'Score'] + 1
    });
    this._stopGame();

    if (scorer === 'ai') {
      setTimeout(()=>{
        this._context.font = '30px Lucida Console';
        this._context.fillText("Game Over!",
        this.props.width/2 - 120,
        this.props.height/2 - 40);
        this._context.fillText('Score: ' + state.playerScore,
        this.props.width/2 - 120,
        this.props.height/2);
        this._context.restore();
      }, 0);
    }
    
    else {
      setTimeout(()=>{
        this._setupCanvas();
        this._startGame();
      }, 0);
    }
  },
  _draw() {
    // draw background
    const state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#00ff00";

    // draw scoreboard
    this._context.font = '20px Lucida Console';
    this._context.fillText('Player: ' + state.playerScore , 20, 20 );

    //draw ball
    this._ball().draw();

    //draw paddles
    this._player().draw();
    this._ai().draw();
    // draw the net
    const w = 4;
    const x = (this.props.width - w)*0.5;
    let y = 0;
    const step = this.props.height/20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }

    this._context.restore();
  },
  _update(){
    this._player().update();
    this._ai().update();
    this._ball().update();
  },
  _touch(evt) {
    console.log( evt );
    var yPos = evt.touches[0].pageY - evt.touches[0].target.offsetTop - this.props.paddleHeight/2;
    this._player().position(yPos);
  },
  render() {
    return <canvas
            onTouchStart={this._touch}
            onTouchMove={this._touch}
            style={this._canvasStyle}
            width={this.props.width}
            height={this.props.height}/>
  }
});
