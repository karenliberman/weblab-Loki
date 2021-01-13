import React, { Component } from "react";
import { Link } from "@reach/router";

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to='/game'> Game </Link>
        <Link to='/game'> Settings </Link>
        <Link to='/rules'> Rules </Link>
        <Link to='/game'> Profile </Link>

      </div>
    );
  }
}

export default NavBar;
