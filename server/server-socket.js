let io;
let game;
const logic = require("./logic.js")

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const rooms = {};
const userToRoom = {};
const socketToRoom ={};

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const getUserFromFilterSocketID = (socketid, filter) => {
  const filteredSocketId = socketid.replace(filter, "");
  
  return getUserFromSocketID(filteredSocketId);
};

const addUsertoRoom = (user, room) => {
  if (rooms[room]) {
    if (!(user._id in rooms[room])) {
      const userData = {
        user: user,
        isHost: false,
        isTurn: false,
      }

      rooms[room][user._id] = userData,
      userToRoom[user._id] = room;
    };
  } else {
    rooms[room] = {};
    
    const userData = {
      user: user,
      isHost: false,
      isTurn: false,
    }

    rooms[room][user._id] = userData,
    userToRoom[user._id] = room;
  }
};

const removeUserfromRoom = (user, room) => {
  if (rooms[room].length > 1) {
    if (user._id in Object.keys(rooms[room])) {
      delete rooms[room][user._id]
      delete userToRoom[user._id]
    };
  } else {
    console.log("hididid")
    delete rooms[room];
    delete userToRoom[user._id]
  }
};



const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);
    game = io.of("/game");

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      // Listens for any card placement done by the client
      
    });
    // listens for any message from the client inside game and lobby
    game.on("connection", (socket) => {

      socket.on("disconnect", (reason) => {
        console.log("Player has disconnected")
      });

      // testing purposes
      socket.on("test", (test, room) => {
        console.log(test);
        game.to(room).emit("testping", "testping");
      });

      socket.on("leave", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")

        removeUserfromRoom(user, room);

        socket.leave(room);
        console.log(`Player has left the lobby ${room}`, rooms[room])
      })

      // for joining/creating room
      socket.on("createLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")

        if (!userToRoom[user._id]) {
          addUsertoRoom(user, room);
          
          // make the user the host of the lobby
          rooms[room][user._id].isHost = true;

          socket.join(room);
          console.log(`A player has joined room ${room}`, rooms[room][user._id]);
          console.log(userToRoom[user._id])
        } else if (userToRoom[user._id] === room) {
          socket.join(room);
        } else {
          const oldRoom = userToRoom[user._id];

          removeUserfromRoom(user, oldRoom);
          game.to(socket.id).emit("isJoined", false)
          socket.leave(oldRoom);

          addUsertoRoom(user, room);
          socket.join(room);
        }
      });

      socket.on("checkStatus", (room) => {
        let status;
        const user = getUserFromFilterSocketID(socket.id, "/game#");

        if (userToRoom[user._id] === room) {
          status = true;
          socket.join(room);
        } else {
          status = false;
        };

        game.to(socket.id).emit("isJoined", status);
      });

      socket.on("joinLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#");
        if(rooms[room]) {
          if (!userToRoom[user._id]) {
            addUsertoRoom(user, room);
            socket.join(room);
            console.log(`A player has joined room ${room}`, rooms[room][-1], user._id);
            console.log(userToRoom[user._id])
          } else if (userToRoom[user._id] === room) {
            socket.join(room);
          } else {
            const oldRoom = userToRoom[user._id];

            removeUserfromRoom(user, oldRoom);
            game.to(socket.id).emit("isJoined", false)
            socket.leave(oldRoom);

            addUsertoRoom(user, room);
            socket.join(room);
          };
        } else {
          game.to(socket.id).emit("isJoined", false)
        };
      });

      socket.on("rejoinLobby", (room) => {

      });

      // use for playing the game
      socket.on("move", (index, hand, deck, rule) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")

        const room = userToRoom[user._id];
        const numPlayers = Object.keys(rooms[room]).length
        const checkifTurn = rooms[room][user._id].isHost;

        if (checkifTurn) {
          if (user) {
            console.log("Move received")
            const newState = logic.playerMove(index, hand, deck, rule);
            const newHand = newState[0];
            const newDeck = newState[1];
            const winner = newState[2];

            // Sets the next turn to the next player
            const nextTurn = (Object.keys(rooms[room]).indexOf(user._id) + 1) % numPlayers;
            const nextUser = Object.keys(rooms[room])[nextTurn];

            rooms[room][user._id].isTurn = false;
            rooms[room][nextUser].isTurn = true;
            
            if (winner) {
              const message = `${user._id} has won the game!`
              game.to(room).emit("winner", message);
            } else {
              game.to(socket.id).emit("update", newHand, newDeck);
            }
          };
        } else {
          const newHand = logic.violation(hand);
          const newDeck = deck;
          game.to(socket.id).emit("update", newHand, newDeck);
        };

        
      });
    });
    // socket for games and lobbies
    // game.on("connection", (socket) => {
    //   game.emit("hi", "hello");
    //   console.log("A player has joined!");
    //   game.on("disconnect", (reason) => {
    //     console.log("A player has disconnected!")
    //   });
    //   game.on("move", (index, hand, deck) => {
    //     consst user = getUserFromSocketID(socket.id);
    //     if (user) {
    //       const newState = logic.playerMove(index, hand, deck);
    //       const newHand = newState[0];
    //       const newDeck = newState[1];
    //       const winner = newState[2];
    //       game.emit("update", newHand, newDeck, winner);
    //     };
    //   });
    // });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
