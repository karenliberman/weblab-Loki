import React, { Component } from "react";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
      <div className={`card-${this.props.suit} card`} >
        Card Suit: {this.props.suit} Value: {this.props.value} Unique.id: {this.props._id}
        <button onClick={this.props.playerMove}>Place</button>
      </div>
      </li>
    );
  }
}

export default Card;