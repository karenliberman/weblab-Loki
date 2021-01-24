import React, { Component } from "react";
import "../../utilities.css"
import { gamesocket } from "../../client-socket.js";
import { Link } from "@reach/router";


class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          This is the lobby! Yay!!!
      </div>
    );
  }
}

export default Lobby;
