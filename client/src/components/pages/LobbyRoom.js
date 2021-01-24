import React, { Component } from "react";
import { gamesocket } from "../../client-socket.js";
import { Link } from "@reach/router";


class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    gamesocket.on("testping", (test) => console.log("xddddd"));
  }

  render() {
    return (
      <div>
        This is the lobby! Yay!!!
        <button onClick={this.props.join}> button </button>
        <button onClick={this.props.test}> test </button>
        <Link to="/rules/">
          <button onClick={this.props.test}> rules </button>
        </Link>
      </div>
    );
  }
}

export default Lobby;
