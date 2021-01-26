import React, { Component } from "react";
import { createLobby, joinLobby } from "../../client-socket.js";
import { Link } from "@reach/router";
import CreateLobby from "../modules/CreateLobby.js";
import JoinLobby from "../modules/JoinLobby.js";



class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
  }


  render() {
    return (
      <>
        <div>
          <CreateLobby />
        </div>
        <div>
          <JoinLobby />
        </div>
      </>
    );
  }
}

export default Lobby;
