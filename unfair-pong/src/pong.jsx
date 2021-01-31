/**
 * Created by Oakley Hall on 6/19/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { db } from './firebase';

var createReactClass = require('create-react-class');

export default createReactClass({
  propTypes: {
    height: PropTypes.number,
    width: PropTypes.number
  },
  getDefaultProps() {
    return {
      height: 700,
      width: 1400
    }
  },
  getInitialState() {
    return {
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 2.5,
      ballSize: 10,
      ballx: 100,
      bally: 100,
      ballSpeed: 2,
      ballSpeedOld: 2,
      velx: 0,
      vely: 0,
      aix: 1370,
      aiy: 100,
      playerx: 10,
      playery: 100,
      playerScore: 0,
      aiScore: 0,
      eventTriggerVal: Math.floor(Math.random() * 5) + 1,
      paddleHits: 0,
      difficulty: 1,
      enable3D: false,
      randomSize: false,
      mostRecentEvent: "",
      smashMultiplier: 1
    }
  },
  componentDidMount: function () {
    this._setupCanvas();
    this._context.font = '100px Lucida Console';
    this._context.fillText('UNFAIR PONG',
      this.props.width / 2 - 320,
      this.props.height / 2);

    setTimeout(this._startGame, 3000);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _ball: require('./ball'),
  _player: require('./player'),
  _ai: require('./ai'),
  _border: require('./border'),
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

    if (this._loop) {
      return;
    }

    const keystate = this._keystate;
    document.addEventListener('keydown', function (evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function (evt) {
      delete keystate[evt.keyCode];
    });
    document.addEventListener('ontouchstart', function (e) { e.preventDefault() }, false);
    document.addEventListener('ontouchmove', function (e) { e.preventDefault() }, false);

    this._loop = setInterval(() => {
      this._update();
      this._draw();
      this._triggerEvent();
    }, 1);

    this._timer = setInterval(() => {
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
    setTimeout(() => {
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }, 0);

  },
  _setupCanvas: function () {
    this._canvas = ReactDOM.findDOMNode(this);
    this._context = this._canvas.getContext('2d');
  },
  _score(name) {
    const state = this.state;
    const scorer = { player: 'ai', ai: 'player' }[name];
    this.setState({
      [scorer + 'Score']: state[scorer + 'Score'] + 1
    });
    this._stopGame();

    if (scorer === 'ai') {
      // Get the recorded scores from the DB
      db.collection("HighScores")
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          data.sort((a, b) => a.score > b.score ? -1 : 1);

          if (state.playerScore < data[4].score) {
            document.getElementById('initials').innerHTML = "BETTER LUCK NEXT TIME!";
          }

          for(let rank = 0; rank < 5; rank++){
            if (rank < data.length) {
                document.getElementById("score" + (rank+1)).innerHTML = data[rank].score;
                document.getElementById("name" + (rank+1)).innerHTML = data[rank].name;
            } else {
                break;
            }
          }
        });

      // TODO: change once we are able to gets highscores from DB
      // if state.playerScore < lowest high score, or something like that
      if (state.playerScore < 1) {
        setTimeout(()=>{
          this._context.font = '80px Lucida Console';
          this._context.fillText("GAME OVER!",
            this.props.width/2 - 240,
            this.props.height/2 - 80);
          
          this._context.font = '60px Lucida Console';
          this._context.fillText('Score: ' + state.playerScore,
            this.props.width/2 - 160,
            this.props.height/2);
          this._context.restore();
        }, 0);
      }
      else {
        const style_scorerow = {
          display: "flex",
          justifyContent: "center",
          fontFamily: "Lucida Console",
          fontSize: 40,
          color: "black",
          height: 70,
          width: "100%"
        };

        const style_scorecell = {
          width:'33%',
          display:'flex',
          justifyContent:'center'
        };

        const initials = [];

        document.addEventListener('keypress', function(event) {
          if (event.key !== undefined) {
            const keypress = (event.key).toUpperCase();
            if (keypress <= 'Z' && keypress >= 'A') {
              if (initials.length === 0) {
                initials.push(keypress);
                document.getElementById("initials").innerHTML = "ENTER INITIALS: " + initials[0] + " _ _";
              }
              else if (initials.length === 1) {                
                initials.push(keypress);
                document.getElementById("initials").innerHTML = "ENTER INITIALS: " + initials[0] + " " + initials[1] + " _";
              }
              else if (initials.length === 2) {
                initials.push(keypress);
                document.getElementById("initials").innerHTML = "ENTER INITIALS: " + initials[0] + " " + initials[1] + " " + initials[2];

                // Add the new score to the DB
                db.collection("HighScores").add ({
                  name: initials[0] + " " + initials[1] + " " + initials[2],
                  score: state.playerScore
                })
                .then(function () {
                  console.log("Successfully submitted score");
                  
                  db.collection("HighScores")
                    .get()
                    .then(querySnapshot => {
                      const data = querySnapshot.docs.map(doc => doc.data());
                      data.sort((a, b) => a.score > b.score ? -1 : 1);
                              
                      for(let rank = 0; rank < 5; rank++){
                        if (rank < data.length) {
                            document.getElementById("score" + (rank+1)).innerHTML = data[rank].score;
                            document.getElementById("name" + (rank+1)).innerHTML = data[rank].name;
                        } else {
                            break;
                        }
                      }
                    });
                })
                .catch(function (error) {
                  console.error("Error submitting score: ", error);
                })
              }
            }
          }
        }, true);

        function refreshPage(){
            window.location.reload();
        } 

        const leaderboard =
          <div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <img src="../8-bit-logo.png" width='400'/>
            </div>
            
            <div style={style_scorerow}>
              <p style={{fontSize:55, marginTop:'0.5cm'}}>LEADERBOARD</p>
            </div>
            <div style={style_scorerow}>
              <p id="initials">ENTER INITIALS: _ _ _</p>
            </div>

            <div style={style_scorerow}>
              <p>RANK</p>
              <p style={style_scorecell}>SCORE</p>
              <p>NAME</p>
            </div>

            <div style={style_scorerow}>
              <p>1ST</p>
              <p id="score1" style={style_scorecell}>9999</p>
              <p id="name1">A B C</p>
            </div>

            <div style={style_scorerow}>
              <p>2ND</p>
              <p id="score2" style={style_scorecell}>9999</p>
              <p id="name2">A B C</p>
            </div>

            <div style={style_scorerow}>
              <p>3RD</p>
              <p id="score3" style={style_scorecell}>9999</p>
              <p id="name3">A B C</p>
            </div>

            <div style={style_scorerow}>
              <p>4TH</p>
              <p id="score4" style={style_scorecell}>9999</p>
              <p id="name4">A B C</p>
            </div>

            <div style={style_scorerow}>
              <p>5TH</p>
              <p id="score5" style={style_scorecell}>9999</p>
              <p id="name5">A B C</p>
            </div>

            <div style={style_scorerow}>
              <p style={{fontSize:30, marginTop:'2cm'}}>Team Jekyll for Swamphacks VII</p>
            </div>
            
            <div style={style_scorerow}>
              <a href='' onClick={refreshPage} style={{fontSize:30, marginTop:'2cm'}}>click here to restart</a>
            </div>

          </div>;

        ReactDOM.render(leaderboard, document.getElementById('root'));
      }
    }

    else {
      setTimeout(() => {
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
    this._context.fillStyle = "white";

    //draw borders
    //this._border.draw();

    // draw scoreboard
    this._context.font = '20px Lucida Console';
    this._context.fillText('Player: ' + state.playerScore , 20, 20 );
    this._context.fillText('Event: ' + state.mostRecentEvent, 300, 20)
    this._context.fillText('Difficulty: ' + 'I '.repeat(state.difficulty) + '- '.repeat(3 - state.difficulty), 1150, 20)

    //draw ball
    this._ball().draw();

    //draw paddles
    this._player().draw();
    this._ai().draw();

    // draw the net
    const w = 4;
    const x = (this.props.width - w) * 0.5;
    let y = 0;
    const step = this.props.height / 20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }

    this._context.restore();
  },
  _update() {
    this._player().update();
    this._ai().update();
    this._ball().update();
  },
  _touch(evt) {
    console.log(evt);
    var yPos = evt.touches[0].pageY - evt.touches[0].target.offsetTop - this.state.paddleHeight / 2;
    this._player().position(yPos);
  },
  // Triggers random event if conditions met
  _triggerEvent() {
    const state = this.state;
    const dif = Math.floor(this.state.playerScore / 30 + 1)

    // Calculates new difficulty level based on time survived
    if (dif != this.state.difficulty && dif < 4) {
      this.setState({
        difficulty: dif
      })
      console.log("Difficulty: ", this.state.difficulty, "\n")
    }

    // To avoid an issue where adjusting speed would break the game
    if (state.ballSpeedOld != state.ballSpeed) {
      this.setState({
        ballSpeedOld: state.ballSpeed
      })
      this._startGame()
    }

    if (this.state.paddleHits == this.state.eventTriggerVal) {
      this.setState({
        paddleHits: 0,
        eventTriggerVal: Math.floor(Math.random() * (5 - this.state.difficulty)) + 1
      });
      this.randomEvent();
    }
  },
  randomEvent() {
    const eventID = Math.floor(Math.random() * ((this.state.difficulty) * 2)) + 1
    var name = ""
    switch (eventID) {
      case 1:
        name = "So Tired"
        this.setState({
          paddleSpeed: this.state.paddleSpeed * 0.75
        })
        break;

      case 2:
        name = "Faster Paddles"
        this.setState({
          paddleSpeed: this.state.paddleSpeed * 1.25
        })
        break;

      case 3:
        name = "Who's Who?"
        const tempX = this.state.playerx
        this.setState({
            playerx: this.state.aix,
            aix: tempX
        })
        break;

      case 4:
        name = "Confused?"
        const temp = this.state.upArrow
        this.setState({
          upArrow: this.state.downArrow,
          downArrow: temp
        })
        break;

      case 5:
        name = "Ad Time!";
        let popup = document.getElementById('popup');
        ReactDOM.render(<img src="https://i.ibb.co/16pm4B2/FAKE-AD.png" style={{ width: '50%', position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', zIndex: 1}}/>, popup);
        popup.onclick = () => { popup.style.display = "none" };

        setInterval(popup.style.display = "block", 5000);

        break;

      case 6:
        name = "3D Ball"
        this.setState({
          enable3D: true
        })
        break;
    }
    console.log(name, eventID)
    this.setState({
        mostRecentEvent: name
    })  
  },
  render() {
    return <canvas
      onTouchStart={this._touch}
      onTouchMove={this._touch}
      style={this._canvasStyle}
      width={this.props.width}
      height={this.props.height} />
  }
});
