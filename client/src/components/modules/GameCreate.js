import React, { Component } from "react";
import { socket } from "../../client-socket.js";
import DeckServer from "./DeckServer.js";
import { post } from "./../../utilities.js";

const uuidv4 = require("uuid/v4");

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 5;
const NUM_DECKS = 1;

class GameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        winner: false,
    }
  }

  componentDidMount = () => {
    // const newDeck = this.multipleDeck(NUM_DECKS);
    const newDeck = []
    // this.shuffleDeck(newDeck);
    const newHand = this.newRandomHand();
    // this is now just the discard pile
    post("/api/deck", {cards: newDeck, gameId: "1", action: "create"});

    post("/api/hand", {cards: newHand, gameId: "1", action: "create"});

    socket.on("update", async (newHand, newDeck, user) => {
      console.log(user._id, this.props.userId);
      if (user._id === this.props.userId) {
        await Promise.all([
        post("/api/deck", {cards: newDeck, gameId: "1", action: "update"}),
        post("/api/hand", {cards: newHand, gameId: "1", action: "update"}),
        ]);
      };
    })

    socket.on("winner", (message) => {
      this.setState({winner: message});
      post("/api/deck", { gameId: "1", action: "delete"});
      post("/api/hand", { gameId: "1", action: "delete"});
    })

  }
  newRandomHand = () => {
    let hand = [];
    for (let i=0; i < CARD_IN_HAND; i++) {
      let newCard = this.newCard();
      hand.push(newCard);
    }
    return hand;
  }

  newHand = (deck) => {
    let cur_hand = deck.splice(0,CARD_IN_HAND);
    return cur_hand
  } 
  // old way to get cards (may be useful later)
  // newDeck = () => {
  //   let cur_deck = [];
  //   let tmp_id = 0;
  //   for (let i = 0; i < SUITS.length; i++) {
  //       for (let j = 0; j< VALUES.length; j++) {
  //           let cur_card = {
  //               _id: tmp_id,
  //               suit: SUITS[i],
  //               value: VALUES[j]
  //           }
  //           tmp_id += 1;
  //           cur_deck.push(cur_card);
  //       }
  //   }
  //   return cur_deck;
  // }

  // multipleDeck = (numDecks) => {
  //   let cur_deck = [];
  //   for (let i = 0; i < numDecks; i++) {
  //     const deck = this.newDeck();
  //     cur_deck = cur_deck.concat(deck);
      
  //   };

  //   return cur_deck;
  // }

  // shuffleDeck = (deck) => {
  //   for (let i = deck.length - 1; i > 0; i--) {
  //       let j = Math.floor(Math.random() * (i+1));
  //       [deck[i], deck[j]] = [deck[j], deck[i]];
  //   }
  // }

  newCard = () => {
    const id = uuidv4();
    const suit = Math.floor(Math.random()*(4));
    const value = Math.floor(Math.random()*(13));
    const card = {
      suit: SUITS[suit],
      value: VALUES[value],
      _id: id, 
    };
    return card;
  }


  render() {
    let showGame;
    if (!this.state.winner) {
        showGame =  this.props.userId && (<DeckServer winner={this.state.winner} />);
    } else {
        showGame = (<p>{this.state.winner}</p>);
    };
    return (

      <div>
          {showGame}
      </div>
    );
  }
}

export default GameCreate;