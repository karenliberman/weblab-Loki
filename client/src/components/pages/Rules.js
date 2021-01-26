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
    <div className="EpicRules-background">
      <div className="EpicRules-alpha">
      <div className="EpicRules-container">
        Put red cards (hearts, diamonds) before black ones (spades, clubs)        
      </div>

      <div className="EpicRules-container">
        Place the high card! (A is the lowest, K is the highest)
      </div>

      <div className="EpicRules-container">
        More rules to come
      </div>
      </div>
    </div>
    );
  }
}

export default Rules;
