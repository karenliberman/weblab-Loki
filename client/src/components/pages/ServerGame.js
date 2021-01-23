import React, { Component } from "react";
import GameCreate from "../modules/GameCreate.js";

class ServerGame extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2> reload the page to see cards </h2>

        <p>Your deck</p>

        {this.props.userId && (<GameCreate userId={this.props.userId} />)}
      </div>
    );
  }
}

export default ServerGame;