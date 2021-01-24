import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import Card from "./Card.js"
import { move } from "../../client-socket.js"
import "./Game.css";


class DeckServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        winner: null,

    }
  }

  componentDidMount = () => {
    socket.on("deck", (deck) => {
      this.setState({cards: deck.cards});
      console.log("this should only log once")
    });

    socket.on("hand", (hand) => {
      this.setState({hand: hand.cards});
    });

    socket.on("updateDeck", (deck) => {
      this.setState({cards: deck.cards})
    });

    socket.on("updateHand", (hand) => {
      this.setState({hand: hand.cards})
    });
  }

  componentWillUnmount = () => {
    socket.removeAllListeners("deck");
    socket.removeAllListeners("hand");
    socket.removeAllListeners("updateDeck");
    socket.removeAllListeners("updateHand");
  }





  render() {
    
    return (

      <div>

        hand
        <div className = "handContainer">
        {this.state.hand.map((card, index) => (<Card value={card.value} suit={card.suit} _id={card._id} playerMove={() => move(index, this.state.hand, this.state.cards)}/>))}
        </div>

        
        <br/>
        <br/>


        Discard Pile
        <div className = "handContainer">
        {this.state.cards.map((card, index) => (<Card value={card.value} suit={card.suit} _id={card._id}/>))}
        </div>

      </div>
    );
  }
}

export default DeckServer;