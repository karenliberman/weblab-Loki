import React, { Component } from "react";
import { socket, gamesocket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import Card from "./Card.js"
import { move } from "../../client-socket.js"
import "./Game.css";
import "./Cards.css";
import {DragDropContext, Droppable} from 'react-beautiful-dnd';



class DeckServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        winner: null,
        placedCard: "placeCard",
        lastCard: "placeCard",
        isTurn: false,

    }
  }

  componentDidMount = () => {
    socket.on("deck", (deck) => {
      this.setState({cards: deck.cards});
      console.log("this should only log once")
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

    gamesocket.on("actualLastCard", (card) => {
      if (card !== null){
        this.setState({lastCard: card.suit+card.value})
      }
      
      
    })

    /* Kill if broken */
    if (this.props.playerTurn == this.props.userName) {
      this.setState({isTurn: true});
    }
  }

  componentWillUnmount = () => {
    socket.removeAllListeners("deck");
    socket.removeAllListeners("hand");
    socket.removeAllListeners("updateDeck");
    socket.removeAllListeners("updateHand");
    gamesocket.removeAllListeners("newLastCard");
  }

  onDragEnd = result => {
    const { destination, source, draggableId} = result;

    if (!destination){
      return;
    }
    if (destination.droppableId== source.droppableId && destination.index == source.index) {
      return;
    }
    const movingCard = this.state.hand[source.index];
    if (destination.droppableId == "targetContainer"){
      this.setState({lastCard: movingCard.suit+movingCard.value});
      move(source.index, this.state.hand, this.state.cards, this.props.rule);
      
      this.state.hand.splice(source.index, 1);
      
      
      return;
    }
    
    const cardHandBox = "handContainer";
    const newHand =  Array.from(this.state.hand)
    newHand.splice(source.index, 1);
    newHand.splice(destination.index, 0, movingCard);

    this.setState({hand: newHand});
  };

 

  render() {


    
    return (

      <div >

        <DragDropContext onDragEnd={this.onDragEnd}
        >
        

        <div className="u-textCenter">
            {this.props.playerTurn ? (<h3>{this.props.playerTurn}'s Turn</h3>) : (<h3> Game has yet to start</h3>)}
            {console.log("ITS ME:", this.props.userName)}
        
        </div>

        <div className="gameTable">

        <Droppable droppableId={"targetContainer"} direction="horizontal">

        {(provided, snapshot) => (
        <div className = {(this.props.isDraggingOver ? "hoverPile" : "cardPile")} ref={provided.innerRef} {...provided.droppableProps} 
        isDraggingOver={snapshot.isDraggingOver}
        >

        <div className={"cardSetting " + this.state.lastCard}> </div>

        </div>
        )}
        </Droppable>

          

        </div>
        <br/>
        <br/>

        <Droppable droppableId={"handContainer"} direction="horizontal">
        {(provided) => (

        <div className = {`${this.state.isTurn}-isTurn handContainer`} ref={provided.innerRef} {...provided.droppableProps}>
          {this.state.hand.map((card, index) => (<Card value={card.value} index={index} key={card._id} suit={card.suit} _id={card._id} playerMove={() => move(index, this.state.hand, this.state.cards)}/>))}
          {provided.placeholder}
        </div>

        )}
        </Droppable>
        <br/>
        <br/>


        <Droppable droppableId={"discardedContainer"} direction="horizontal">
        {(provided) => (
        <div className = "handContainer" ref={provided.innerRef} {...provided.droppableProps}>
        {this.state.cards.map((card, index) => (<Card value={card.value} index={index} key={card._id} suit={card.suit} _id={card._id}/>))}
        {provided.placeholder}
        </div>
        )}
        </Droppable>
        
        <br/>
        <br/>

        {/* Last Card Played
        {this.state.lastCard &&
          (<Droppable droppableId={"discardedContainer"} direction="horizontal">
          {(provided) => (
          <div className = "handContainer" ref={provided.innerRef} {...provided.droppableProps}>
          {this.state.lastCard.map((card, index) => (<Card value={card.value} index={index} key={card._id} suit={card.suit} _id={card._id}/>))}
          {provided.placeholder}
          </div>
          )}
          </Droppable>) */}
        {/* } */}
        
        
        </DragDropContext>
      </div>
    );
  }
}

export default DeckServer;