import React, { Component } from "react";
import { Link } from "@reach/router";
import { join } from "../../client-socket.js"




class CreateLobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: "",
        };

    };

    componentDidMount = () => {
        this.getNewRoomId();
    };

    getNewRoomId = () => {
        const newRoomId = this.newRoomId(6);
        this.setState({ roomId: newRoomId});

    };

    newRoomId = (numCharacters) => {
        let roomId = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < numCharacters; i++) {
            const random = Math.floor(Math.random() * characters.length);

            roomId += characters.charAt(random);
        };

        return roomId;
    }

    render() {
        return (
            <div>
                <Link to={`/lobby/${this.state.roomId}`}>
                    <button onClick={() => join(this.state.roomId)}>create room</button>
                </Link>
            </div>

        )

    }
};

export default CreateLobby;