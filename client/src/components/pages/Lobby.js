import React, { Component } from "react";
import { gamesocket } from "../../client-socket.js";
import { Link } from "@reach/router";
import CreateLobby from "../modules/CreateLobby.js";


class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
  }


  render() {
    return (
      <div>
        <CreateLobby />
      </div>
    );
  }
}

export default Lobby;
