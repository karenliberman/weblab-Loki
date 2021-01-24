import React, { Component } from "react";
import { gamesocket } from "../../client-socket.js";
import { Link } from "@reach/router";
import { test, leave} from "../../client-socket.js";


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoined: null,
    }
  }

  componentDidMount = () => {
    gamesocket.emit("checkStatus", this.props.roomId);

    gamesocket.on("isJoined", (status) => {
      if (status) {
        this.setState({ isJoined: true})
      } else {
        this.setState({ isJoined: false})
      }
    })
    gamesocket.on("testping", (test) => console.log("xddddd", this.props.roomId));
  }

  componentWillUnmount = () => {
    gamesocket.removeAllListeners();
  }

  render() {
    return (
      <div>
        {this.state.isJoined ? (<div>
          This is the lobby! Yay!!!
          <button onClick={() => test(this.props.roomId)}> test </button>
          <Link to="/">
            <button onClick={() => leave(this.props.roomId)}> leave </button>
          </Link>
        </div>) : (
          <div>
            Not joined yet!
          </div>
        )}
        
        
      </div>
    );
  }
}

export default Lobby;
