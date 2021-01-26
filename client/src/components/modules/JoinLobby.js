import React, { Component } from "react";
import { Link } from "@reach/router";
import { joinLobby } from "../../client-socket.js";






class JoinLobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: "",
        };

    };


    handleChange = (event) => {
        this.setState({
            roomId: event.target.value,
        });
    };

    render() {
        let roomId = this.state.roomId;
        let link = `/lobby/${roomId}`;
        console.log(link)
        return (
            <div>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <Link to={link}>
                    <button onClick={() => joinLobby(this.state.roomId)}>Join room</button>
                </Link>
            </div>

        )

    }
};

export default JoinLobby;