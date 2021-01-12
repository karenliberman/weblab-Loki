import React, { Component } from "react";

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 10;

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: this.newDeck(),
        hand: [],
        discard: []
    }
  }
  /* TO DO
  componentDidMount = () => {
    this.setState({hand: this.newHand()})
    console.log("success");
  }

  newHand = () => {
    
  } */



  newDeck = () => {
      let cur_deck = []
      for (let i = 0; i < SUITS.length; i++) {
          for (let j = 0; j< VALUES.length; j++) {
              let cur_card = {
                  "suit": SUITS[i],
                  "value": VALUES[j]
              }
              cur_deck.push(cur_card);
          }
      }
      return cur_deck;
  }



  render() {
    return (
      <div>
        {JSON.stringify(this.state.cards)}
      </div>
    );
  }
}

export default Deck;