import React, { Component } from "react";
import {get} from "../../utilities";
import "./Rules.css";
import "./EpicRules.css";


class Rules extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <div className="rule-container">
        Put red cards (hearts, diamonds) before black ones (spades, clubs)        
      </div>

      <div className="rule-container">
        Place the high card! (A is the lowest, K is the highest)
      </div>

      <div className="rule-container">
        More rules to come
      </div>
    </div>
    );
  }
}

export default Rules;
