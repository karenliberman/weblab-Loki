import React, { Component } from "react";
import "./Cards.css";


class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      
          <div className={"cardSetting " + this.props.suit + this.props.value} onClick={this.props.playerMove}></div>
    
    );
  }
}

export default Card;