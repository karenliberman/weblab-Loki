// const { post } = require("../client/src/utilities");
const socketManager = require("./server-socket.js");

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 5;
const NUM_DECKS = 1;



const newDeck = () => {
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
};

const newHand = (deck) => {
    let cur_hand = deck.splice(0,CARD_IN_HAND);
    return cur_hand
};

const multipleDeck = (numDecks) => {
    let cur_deck = [];
    for (let i = 0; i < numDecks; i++) {
      const deck = newDeck();
      cur_deck = cur_deck.concat(deck);
      
    };
    return cur_deck;
};

const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
};

const get_color = (cur_card) => {
    return cur_card.suit==="spades" || cur_card.suit==="clubs" ? "black" : "red";
};

const validMove = (index, cur_hand) => {
    //Rule 1 : reds before black
    let copy_hand = cur_hand.slice()
    let cur_card = copy_hand[index];
    let color = get_color(cur_card);

    copy_hand.splice(index, 1);

    if (color === "black") {
      //there better be no reds in the deck
      for(let i = 0; i < copy_hand.length; i++) {
        let check = copy_hand[i]

        if (get_color(check) === "red") {
          return false;
        }
      }
    };

    return true;
};

const checkWin = (hand) => {
    if (hand.length === 0) {
        return true
        };
    return false
};


const gameState = {
    winner: null,
    players: {},
    hand: [],
    deck: [],

}

// const addPlayer = () => {
//     gameState.deck = multipleDeck(NUM_DECKS);
//     // shuffleDeck(gameState.deck);
//     gameState.hand = newHand(gameState.deck);
//     socketManager.getIo().emit(gameState);
// }


const playerMove = (index, hand, deck) => {
    let newHand = hand.slice();
    let newDeck = deck.slice();

    if (validMove(index, newHand)) {
        let removedCard = newHand.splice(index, 1);
        newDeck = newDeck.concat(removedCard);
    } else {
        console.log("Rule 1 Violation");
        let violationCard = newDeck.pop();
        newHand = newHand.concat(violationCard);
    };

    const winner =  checkWin(newHand);


    return([newHand, newDeck, winner]);

};

const removePlayer = (id) => {
    delete gameState.deck;
    delete gameState.hand;
};

module.exports = {
    gameState,
    playerMove,
    // addPlayer,
    removePlayer,
};