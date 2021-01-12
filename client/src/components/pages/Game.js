import React, { Component } from "react";
import Deck from "../modules/Deck.js";

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Welcome to the game! 10/10 UI design</h1>
        <p>Your deck</p>

        <Deck />
      </div>
    );
  }
}

export default Game;
