import React, { Component } from "react";
import { test, leave, changeStatus } from "../../client-socket.js";
import { Link } from "@reach/router";
import "../pages/Rules.css";

class WaitingRoom extends Component {
    constructor(props) {
        super(props);
    };

    render () {
        return (
            <>
              <div>
                This is the lobby! Yay!!!
                <button onClick={() => test(this.props.roomId)}> test </button>
                <Link to="/">
                  <button onClick={() => leave(this.props.roomId)}> leave </button>
                </Link>
                {this.props.host && (<button onClick={() => changeStatus(this.props.roomId, "game")} > Start Game </button>)}
              </div>
              <div>
                  Copy Room ID: <button onClick={() => navigator.clipboard.writeText(this.props.roomId)}>{this.props.roomId}</button>
              </div>
              <div>
                {this.props.players && this.props.players.map((player) => (<div className="rule-container">{player}</div>))}
              </div>
            </>
          );
    }
};

export default WaitingRoom;