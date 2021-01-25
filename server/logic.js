const uuidv4 = require("uuid/v4");
const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const get_color = (cur_card) => {
    return cur_card.suit==="spades" || cur_card.suit==="clubs" ? "black" : "red";
};

const validMove = (index, cur_hand, rule_index) => { //add rule_index here
  console.log("Checks move")
  if(rule_index == 0) {
    return rule1(index, cur_hand);
  } else {
    return rule2(index, cur_hand);
  }
};

/* framework for implementing more rules */
const rule1 = (index, cur_hand) => {
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
}


const rule2 = (index, cur_hand) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];
  let card_value = cur_card.value;
  copy_hand.splice(index, 1);


  for(let i = 0; i< copy_hand.length; i++) {
    let check = copy_hand[i].value;
    if (VALUES.indexOf(check) > VALUES.indexOf(card_value)) {
      return false
    }
  }
  return true
}

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

const playerMove = (index, hand, deck, rule) => {
    let newHand = hand.slice();
    let newDeck = deck.slice();

    if (validMove(index, newHand, rule)) {
        let removedCard = newHand.splice(index, 1);
        newDeck = newDeck.concat(removedCard);
    } else {
        newHand = violation(newHand);
    };

    const winner =  checkWin(newHand);


    return([newHand, newDeck, winner]);

};

const violation = (hand) => {
  console.log("A rule has been violated!");
  let newHand = hand.slice();
  const violationCard = newCard();

  newHand = newHand.concat(violationCard);
  
  return newHand;
}


module.exports = {
    playerMove,
    violation,
};