import React, { Component } from "react";
import GameCreate from "../modules/GameCreate.js";
import "../../utilities.css";

class ServerGame extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="u-textCenter trump2020">
        <h2> reload the page to see cards </h2>

        <p>Your deck</p>

        {this.props.userId && (<GameCreate userId={this.props.userId} />)}
      </div>
    );
  }
}

export default ServerGame;