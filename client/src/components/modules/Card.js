import React, { Component } from "react";
import "../pages/Skeleton.css";


class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
      <div className="cardContainer"> 
          <div className={"cardSetting " + this.props.suit + this.props.value} onClick={this.props.playerMove}></div>
        </div>
      </li>
    );
  }
}

export default Card;