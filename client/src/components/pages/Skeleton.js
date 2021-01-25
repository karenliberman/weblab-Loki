import React, { Component } from "react";
import { Link } from "@reach/router";


import "../../utilities.css";
import "./Skeleton.css";
import "./Landing.css";

const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="u-textCenter">

          <h1>Loki : The Game With No Rules</h1>
          <h2> May the best mind win!</h2>
          <div className="form-box box-shadow">
            <Link to="/lobby"><button className="btn second"> Play Now </button></Link>
            {/*<button class="btn first">Sign in with Google </button>  */}
          </div>
        </div>
      </>
    );
  }
}

export default Skeleton;
