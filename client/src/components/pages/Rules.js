import React, { Component } from "react";
import {get} from "../../utilities";

class Rules extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="container">
      <div className="rule-container">
        Put red cards (hearts, diamonds) before black ones (spades, clubs)        
      </div>

      <div className="rule-container">
        More rules to come
      </div>
    </div>
    );
  }
}

export default Rules;
