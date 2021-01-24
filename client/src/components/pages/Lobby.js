import React, { Component } from "react";
import "../../utilities.css"

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="u-textCenter">
          <h1> This is the lobby! Yay!! </h1>

          <h2> Join Game </h2>
          <input type="text"/> <button> Join </button>

          <h2> Create Game </h2>
          <input type="text" placeholder="Room 123"/> <button> Create </button>
      </div>
    );
  }
}

export default Lobby;
