import React, { Component } from "react";
import { test, leave, startGame } from "../../client-socket.js";
import { Link } from "@reach/router";
import "../pages/Rules.css";
import "./WaitingRoom.css"

class WaitingRoom extends Component {
    constructor(props) {
      super(props);
    };

    render () {
        return (
            <div class="WaitingRoom-container">
              
              <div class="WaitingRoom-item">
                <div>
                  {this.props.players && this.props.players.map((player) => (<div className="rule-container">{player}</div>))}
                </div>
              </div>

              <div class="WaitingRoom-item">
                <div class="WaitingRoom-vertical">
                  This is the lobby! Yay!!!
                  <div>
                  <button  onClick={() => test(this.props.roomId)} class="button2"> test </button>
                  </div>


                  <div>
                  {this.props.host && (<button class="button2 bigboybutton" onClick={() => startGame(this.props.roomId)} > Start Game </button>)}
                  </div>


                  <div>
                  <Link to="/">
                    <button class="button2" onClick={() => leave(this.props.roomId)}> leave </button>
                  </Link>
                  </div>


                </div>
                
              </div>

              <div class="WaitingRoom-third-item WaitingRoom-item">
                <div>
                    Copy Room ID: <button class="button2" onClick={() => navigator.clipboard.writeText(this.props.roomId)}>{this.props.roomId}</button>
                </div>
              </div>
            </div>
          );
    }
};

export default WaitingRoom;