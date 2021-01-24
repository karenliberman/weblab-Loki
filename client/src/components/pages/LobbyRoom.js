import React, { Component } from "react";
import { gamesocket } from "../../client-socket.js";
import { Link } from "@reach/router";
import { test, leave} from "../../client-socket.js";
import GameCreate from "../modules/GameCreate.js";


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoined: null,
      pageStatus: "waiting room",
    }
  }

  componentDidMount = () => {
    gamesocket.emit("checkStatus", this.props.roomId);

    gamesocket.on("isJoined", (status) => {
      if (status) {
        this.setState({ isJoined: true})
      } else {
        this.setState({ isJoined: false})
      }
    })
    gamesocket.on("testping", (test) => console.log("xddddd", this.props.roomId));
  }

  componentWillUnmount = () => {
    gamesocket.removeAllListeners();
  }

  render() {
    if (this.state.isJoined) {
      if (this.state.pageStatus === "waiting room") {
        return (
          <>
            <div>
              This is the lobby! Yay!!!
              <button onClick={() => test(this.props.roomId)}> test </button>
              <Link to="/">
                <button onClick={() => leave(this.props.roomId)}> leave </button>
              </Link>
              <button onClick={() => this.setState({ pageStatus: "game" })} > Start Game </button>
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
