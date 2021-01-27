const uuidv4 = require("uuid/v4");
const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const equalsCard = (firstCard, secondCard) => {
  if (firstCard.value === secondCard.value && firstCard.suit === secondCard.suit) {
    return true;
  };
  return false;
}

const getValue = (card) => {
  let value = VALUES.indexOf(card.value) + 1;
  return value;
}

const newRandomRules = (numRules) => {
  let listofNumbers = [0, 1, 2, 3, 4]
  let randomList = [];
  for (let i = 0; i < numRules; i++) {
    // hardcoded to 5 rules (change later)
    const rand = Math.floor(Math.random()*(listofNumbers.length));
    const remove = listofNumbers.splice(rand, 1)[0];
    randomList.push(remove);
  };
  return randomList;
}

const get_color = (cur_card) => {
    return cur_card.suit==="spades" || cur_card.suit==="clubs" ? "black" : "red";
};


/* framework for implementing more rules */
/* first reds then blacks */
const rule1 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice()
  let cur_card = copy_hand[index];
  let color = get_color(cur_card);

  copy_hand.splice(index, 1);

  if (color === "black") {
    //there better be no reds in the deck
    for(let i = 0; i < copy_hand.length; i++) {
      let check = copy_hand[i]

      if (get_color(check) === "red") {
        return [false, "Rule 1 violation"];
      }
    }
  };

  return [true, ""];
}

/* can only play the highest card */
const rule2 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];
  let card_value = cur_card.value;
  copy_hand.splice(index, 1);


  for(let i = 0; i< copy_hand.length; i++) {
    let check = copy_hand[i].value;
    if (VALUES.indexOf(check) > VALUES.indexOf(card_value)) {
      return [false, "Rule 2 violation"];
    }
  }
  return [true, ""]
};

/* can only play cards in the first half of your hand */
const rule3 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice();
  
  if (index < Math.floor(copy_hand.length / 2) ) {
    return [false, "Rule 3 violation"];
  };
  return [true, ""];
};

/* only play cards with the same suit as the last card */
const rule4 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  
  if (cur_card.suit === last_card.suit) {
    return [true, ""];
  } else {
    for (let i = 0; i < copy_hand.length; i++) {
      const card = copy_hand[i];
      if (card.suit === last_card.suit) {
        return [false, "Rule 4 violation"];
      }
    }
    return [true, ""];
  }
};

/* only place cards with the same parity as the last card*/
const rule5 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);

  if (getValue(cur_card) % 2 === getValue(last_card) % 2) {
    return [true, ""];
  } else {
    for (let i = 0; i<copy_hand.length; i++) {
      const card = copy_hand[i];
      if (getValue(card) % 2 === getValue(last_card) % 2) {
        return [false, "Rule 5 violation"];
      }
    };
    return [true, ""]
  }

};

const rules = [rule1, rule2, rule3, rule4, rule5];

const validMove = (index, cur_hand, lastCard, rulesList) => { //add rule_index here
  console.log("Checks move");

  let isViolation = false;
  let violations = [];
  let changeNumCards = 0;

  for(let i = 0; i < rulesList.length; i++) {
    console.log(rulesList);
    const result = rules[rulesList[i]](index, cur_hand, lastCard);

    if (!result[0]) {
      isViolation = true;
      violations.push(result[1]);
      changeNumCards += 1;
    };
  };

  return [isViolation, violations, changeNumCards];


};

/* */


const newCard = () => {
    const id = uuidv4();
    const suit = Math.floor(Math.random()*Math.random()*(4));
    const value = Math.floor(Math.random()*Math.random()*(13));
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

const playerMove = (index, hand, deck, lastCard, rules) => {
    let newHand = hand.slice();
    let newDeck = deck.slice();

    let moveResults = validMove(index, newHand, lastCard, rules);
    let isViolation = moveResults[0];
    let violations = moveResults[1];
    let changeNumCards = moveResults[2];

    if (!isViolation) {
        let removedCard = newHand.splice(index, 1);
        newDeck = newDeck.concat(removedCard);
        changeNumCards = -1;
        violations = ["No violations"]
    } else {
      let removedCard = newHand.splice(index, 1);
      newDeck = newDeck.concat(removedCard);
      newHand = violation(newHand, changeNumCards);
    };

    const winner =  checkWin(newHand);


    return([newHand, newDeck, winner, isViolation, violations, changeNumCards]);

};

const violation = (hand, numCards) => {
  console.log("A rule has been violated!");
  let newHand = hand.slice();
  for (let i=0; i< numCards; i++) {
    const violationCard = newCard();
    newHand = newHand.concat(violationCard);
  }
  return newHand;
}


module.exports = {
    playerMove,
    violation,
    newRandomRules,
    newCard,
};