import React, { Component } from "react";
import { gamesocket, changeStatus } from "../../client-socket.js";
import { Link } from "@reach/router";
import { test, leave} from "../../client-socket.js";
import GameCreate from "../modules/GameCreate.js";
import WaitingRoom from "../modules/WaitingRoom.js";
import "./Rules.css";


class LobbyRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoined: null,
      pageStatus: null,
      host: false,
      winner: null,
      players: [],
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

    gamesocket.on("newPlayer", (player) => this.setState((prevstate) => ({
      players: prevstate.players.concat([player]),
    })));
  }

  componentWillUnmount = () => {
    gamesocket.removeAllListeners();
  }

  render() {
    const players = this.state.players;

    if (this.state.isJoined) {
      if (this.state.pageStatus === "lobby") {
        return (
          <WaitingRoom roomId={this.props.roomId} players={this.state.players} host={this.state.host} />
        );
      } else if (this.state.pageStatus === "game") {
        return (
          <div>
            <h2> reload the page to see cards </h2>

            <p>Your deck</p>
            <Link to="/">
              <button onClick={() => leave(this.props.roomId)}> leave </button>
            </Link>

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
            <Link to="/">
              <button onClick={() => leave(this.props.roomId)}> leave </button>
            </Link>
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

export default LobbyRoom;
