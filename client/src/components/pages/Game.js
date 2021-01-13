import React, { Component } from "react";
import Deck from "../modules/Deck.js";

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

        <p>Your deck</p>

        <Deck />
      </div>
    );
  }
}

export default Game;
