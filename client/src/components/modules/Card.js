import React, { Component } from "react";
import { Link } from "@reach/router";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to='/game'> Game </Link>
        <Link to='/game'> Settings </Link>
        <Link to='/game'> Rules </Link>
        <Link to='/game'> Profile </Link>

      </div>
    );
  }
}

export default Card;