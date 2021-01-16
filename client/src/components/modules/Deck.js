import React, { Component } from "react";
import { post } from "../../utilities.js";
import Card from "./Card.js"

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 5;
const NUM_DECKS = 1;

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        discard: []
    }
  }

  componentDidMount = () => {
    const newDeck = this.multipleDeck(NUM_DECKS);
    this.shuffleDeck(newDeck);
    post("/api/deck", {cards: newDeck, action: "create"}).then((data) => {
      this.setState({cards: data.cards});
      this.setState({hand: this.newHand()})
    }).then(() => post("/api/deck", {action: "delete"})); //later will be used when a player wins
    
    console.log(this.state.cards);
  }

  newHand = () => {
    let cur_deck = this.state.cards.slice();
    let cur_hand = cur_deck.splice(0,CARD_IN_HAND);

    this.setState({cards: cur_deck})
    return cur_hand
  } 

  newDeck = () => {
    let cur_deck = [];
    let tmp_id = 0;
    for (let i = 0; i < SUITS.length; i++) {
        for (let j = 0; j< VALUES.length; j++) {
            let cur_card = {
                _id: tmp_id,
                suit: SUITS[i],
                value: VALUES[j]
            }
            tmp_id += 1;
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

  playerMove = (index) => {
    let newCards = this.state.hand.slice();
    let newDiscardPile = this.state.discard.slice();
    let newDeck = this.state.cards.slice();

    if (this.validMove(index, newCards.slice())) {
      let removedCard = newCards.splice(index, 1);
      newDiscardPile = newDiscardPile.concat(removedCard);
    } else {
      console.log("Rule 1 Violation");
      let violationCard = newDeck.pop();
      newCards = newCards.concat(violationCard);
    }
    post("/api/deck", {cards: newDeck, action: "update"}).then((deck) => {
      this.setState({discard: newDiscardPile});
      this.setState({cards: deck.cards})
      this.setState({hand: newCards})
    });
  }

  validMove = (index, cur_hand) => {
    //Rule 1 : reds before black

    let cur_card = cur_hand[index];
    let color = this.get_color(cur_card);

    cur_hand.splice(index, 1);

    if (color === "black") {
      //there better be no reds in the deck
      for(let i = 0; i < cur_hand.length; i++) {
        let check = cur_hand[i]

        if (this.get_color(check) === "red") {
          return false;
        }
      }
    }

    return true;
  }

  get_color = (cur_card) => {
    return cur_card.suit==="spades" || cur_card.suit==="clubs" ? "black" : "red";
  }


  render() {
    let showDeck;
    let showHand;
    if (!this.state.deck) {
      showDeck =  this.state.cards.map((card, index) => (
        <Card value={card.value} suit={card.suit} _id={card._id}/>
      ));
      showHand = this.state.hand.map((card, index) => (
        <Card value={card.value} suit={card.suit} _id={card._id} playerMove={() => this.playerMove(index)}/>
      ));
    } else {
      showDeck = (<p>wait</p>)
      showHand = (<p>wait</p>)
    }
    return (

      <div>


        hand
        <ol>
        {showHand}
        </ol>

        
        <br/>
        <br/>


        Deck
        <ol>
        {showDeck}
        </ol>

      </div>
    );
  }
}

export default Deck;