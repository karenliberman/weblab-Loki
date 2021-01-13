import React, { Component } from "react";
import { Link } from "@reach/router";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Card Suit: {this.props.suit} Value: {this.props.value} Unique.id: {this.props._id}
        <button onClick={this.props.playerMove}>Place</button>
      </div>
    );
  }
}

export default Card;