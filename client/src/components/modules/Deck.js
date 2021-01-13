import React, { Component } from "react";
import Card from "./Card.js"

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 10;
const NUM_DECKS = 2;

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: this.multipleDeck(NUM_DECKS),
        hand: [],
        discard: []
    }
  }

  componentDidMount = () => {
    this.shuffleDeck(this.state.cards);
    this.setState({hand: this.newHand()})
    console.log("you should see your hand");
  }

  newHand = () => {
    let cur_deck = {...this.state.cards};
    let cur_hand = [];
    for(let i = 0; i<5; i++) {
      cur_hand.push(cur_deck[i])
    }
    console.log(cur_hand);
    return cur_hand
  } 

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

  multipleDeck = (numDecks) => {
    let cur_deck = [];
    for (let i = 0; i < numDecks; i++) {
      const deck = this.newDeck();
      cur_deck = cur_deck.concat(deck);
      
    };

    return cur_deck;
  }

  shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}



  render() {
    return (

      <div>
        Deck
        {this.state.cards.map((card) => (
          <Card value={card.value} suit={card.suit} />
        ))}


        <br/>
        <br/>

        hand
        {this.state.hand.map((card) => (
          <Card value={card.value} suit={card.suit} />
        ))}
      </div>
    );
  }
}

export default Deck;