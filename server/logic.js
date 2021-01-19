const uuidv4 = require("uuid/v4");
const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

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

const newCard = () => {
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

const checkWin = (hand) => {
    if (hand.length === 0) {
        return true
        };
    return false
};

const playerMove = (index, hand, deck) => {
    let newHand = hand.slice();
    let newDeck = deck.slice();

    if (validMove(index, newHand)) {
        let removedCard = newHand.splice(index, 1);
        newDeck = newDeck.concat(removedCard);
    } else {
        console.log("Rule 1 Violation");
        let violationCard = newCard();
        newHand = newHand.concat(violationCard);
    };

    const winner =  checkWin(newHand);


    return([newHand, newDeck, winner]);

};


module.exports = {
    playerMove,
};