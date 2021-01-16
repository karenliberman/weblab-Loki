const { post } = require("../client/src/utilities");

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

    let cur_card = cur_hand[index];
    let color = get_color(cur_card);

    cur_hand.splice(index, 1);

    if (color === "black") {
      //there better be no reds in the deck
      for(let i = 0; i < cur_hand.length; i++) {
        let check = cur_hand[i]

        if (get_color(check) === "red") {
          return false;
        }
      }
    };
};

const checkWin = () => {
    Object.keys(gameState.players).forEach((key) => {
        const hand = gameState.players[key];

        if (hand.length === 0) {
            gameState.winner = key;
            return true
        };

    })
    return false
};


const gameState = {
    winner: null,
    players: {},
    hand: [],
    deck: [],
    stack: [],
}

const addPlayer = () => {
    gameState.deck = multipleDeck(NUM_DECKS);
    shuffleDeck(gameState.deck);
    gameState.hand = newHand(gameState.deck);
    post("/api/deck", {cards: gameState.deck, action: "create"});
}


const playerMove = (index, id) => {
    let hand = gameState.players[id];
    let deck = gameState.deck

    if (validMove(index, hand)) {
        let removedCard = hand.splice(index, 1);
        deck = deck.concat(removedCard);
    } else {
        console.log("Rule 1 Violation");
        let violationCard = deck.pop();
        hand = hand.concat(violationCard);
    };

    checkWin();

    post("/api/deck", {cards: gameState.deck, action: "update"});
};

const removePlayer = (id) => {
    delete gameState.players[id];
};

module.exports = {
    gameState,
    playerMove,
    addPlayer,
    removePlayer,
};