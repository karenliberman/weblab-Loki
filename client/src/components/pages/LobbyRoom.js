import React, { Component } from "react";
import { gamesocket, changeStatus } from "../../client-socket.js";
import { Link } from "@reach/router";
import { test, leave} from "../../client-socket.js";
import GameCreate from "../modules/GameCreate.js";


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoined: null,
      pageStatus: null,
      host: false,
      winner: null,
    }
  }

  componentDidMount = () => {
    gamesocket.emit("checkJoined", this.props.roomId);
    gamesocket.emit("checkHost", this.props.roomId);
    

    gamesocket.on("isJoined", (status) => {
      if (status) {
        this.setState({ isJoined: true})
      } else {
        this.setState({ isJoined: false})
      }
    })
    gamesocket.on("testping", (test) => console.log("xddddd", this.props.roomId));

    gamesocket.on("statusChange", (status, winner) => {
      console.log("hello");
      this.setState({ pageStatus: status, winner: winner });
    });

    gamesocket.on("newHost", (isHost) => {
      this.setState({ host: isHost });
      console.log("there is a new host");
    });
  }

  componentWillUnmount = () => {
    gamesocket.removeAllListeners();
  }

  render() {
    if (this.state.isJoined) {
      if (this.state.pageStatus === "lobby") {
        return (
          <>
            <div>
              This is the lobby! Yay!!!
              <button onClick={() => test(this.props.roomId)}> test </button>
              <Link to="/">
                <button onClick={() => leave(this.props.roomId)}> leave </button>
              </Link>
              {this.state.host && (<button onClick={() => changeStatus(this.props.roomId, "game")} > Start Game </button>)}
            </div>
          </>
        );
      } else if (this.state.pageStatus === "game") {
        return (
          <div>
            <h2> reload the page to see cards </h2>

            <p>Your deck</p>

            {this.props.userId && (<GameCreate userId={this.props.userId} gameId={this.props.roomId} />)}
          </div>
        );
      } else if (this.state.pageStatus === "winner") {
        return (
          <div>
            {this.state.winner}
            <div>
              <button onClick={() => changeStatus(this.props.roomId, "lobby")} > Return to Lobby </button>
            </div>
          </div>
        )
      }
    };

    return (
      <div>
        Not joined yet!
      </div>
    )
  }
}

export default Lobby;
