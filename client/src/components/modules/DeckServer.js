import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import Card from "./Card.js"
import { move } from "../../client-socket.js"


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





  render() {
    
    return (

      <div>

        hand
        <ol>
        {this.state.hand.map((card, index) => (<Card value={card.value} suit={card.suit} _id={card._id} playerMove={() => move(index, this.state.hand, this.state.cards)}/>))}
        </ol>

        
        <br/>
        <br/>


        Discard Pile
        <ol>
        {this.state.cards.map((card, index) => (<Card value={card.value} suit={card.suit} _id={card._id}/>))}
        </ol>

      </div>
    );
  }
}

export default DeckServer;