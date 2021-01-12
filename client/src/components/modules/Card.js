import React, { Component } from "react";
import { Link } from "@reach/router";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input type="checkbox" />
        Card {this.props.suit} {this.props.value}
      </div>
    );
  }
}

export default Card;