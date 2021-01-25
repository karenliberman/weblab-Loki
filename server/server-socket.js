let io;
let game;
const logic = require("./logic.js");
const user = require("./models/user.js");

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const rooms = {};
const userToRoom = {};
const socketToRoom = {};

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const getListofPlayers = (room) => {
  try {
    const players = Object.keys(rooms[room]).slice(1);
    return players;
  } catch (error) {
    console.log(error);
  }
};

const getUserFromFilterSocketID = (socketid, filter) => {
  const filteredSocketId = socketid.replace(filter, "");
  
  return getUserFromSocketID(filteredSocketId);
};

const changeReadyStatus = (room, users, status) => {
  for (let i = 0; i < users.length; i++) {
    rooms[room][users[i]].isReady = status;
  };
};

const checkIfAllReady = (room) => {
  const players = getListofPlayers(room);
  for (let i = 0; i < players.length; i++) {
    if (!rooms[room][players[i]].isReady) {
      return false;
    }
  }
  return true;
};

const changeHost = (room, socket, status) => {
  rooms[room][socket].isHost = status;
};

const nextTurn = (room, socket) => {
  const players = getListofPlayers(room);
  const numPlayers = players.length;

  const nextTurn = (players.indexOf(socket.id) + 1) % numPlayers;
  const nextUser = players[nextTurn];

  console.log(socket.id, "this is the old turn");
  console.log(nextUser, "this is the new turn");

  rooms[room][socket.id].isTurn = false;
  rooms[room][nextUser].isTurn = true;

}


const addUsertoRoom = (user, socket, room) => {
  if (rooms[room]) {
    if (!(socket.id in rooms[room])) {
      const userData = {
        name: user.name,
        _id: user._id,
        isHost: false,
        isTurn: false,
        isReady: true,
      }

      rooms[room][socket.id] = userData,
      userToRoom[user._id] = room;
      socketToRoom[socket.id] = room;
    };
  } else {
    rooms[room] = {
      pageStatus: "lobby",
    };
    
    const userData = {
      name: user.name,
      _id: user._id,
      isHost: true,
      isTurn: false,
      isReady: true,
    }

    rooms[room][socket.id] = userData;
    userToRoom[user._id] = room;
    socketToRoom[socket.id] = room;
  }
};

const removeUserfromRoom = (socket) => {
  const room = socketToRoom[socket.id];
  const user = getUserFromFilterSocketID(socket.id);
  if (room) {
    if (rooms[room][socket.id].isTurn) {
      nextTurn(room, socket);
    }
    if (Object.keys(rooms[room]).length > 2) {
      console.log("there is still at least a person left")
      delete rooms[room][socket.id]
      delete socketToRoom[socket.id]
    } else {
      console.log("the room has been deleted")
      delete rooms[room];
      delete socketToRoom[socket.id]
    };
    if (user) delete userToRoom[user._id];
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
        removeUserfromRoom(socket);
      });

      // testing purposes
      socket.on("test", (test, room) => {
        console.log(test);
        game.to(room).emit("testping", "testping");
      });

      socket.on("leave", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")
        removeUserfromRoom(socket);

        // Changes the host if the previous host leaves
        if (rooms[room]) {
          const playerSockets = getListofPlayers(room);
          const newSocketHost = playerSockets[0];
          const newHost = getUserFromFilterSocketID(newSocketHost);

          changeHost(room, newSocketHost, true);
          game.to(newSocketHost).emit("newHost", true);
        }

        socket.leave(room);
        console.log(`Player has left the lobby ${room}`, rooms[room])
      })

      // for joining/creating room
      socket.on("createLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")
        addUsertoRoom(user, socket, room);
        
        // make the user the host of the lobby
        changeHost(room, socket, true);

        socket.join(room);
        console.log(`A player has joined room ${room}`, rooms[room]);
      });

      socket.on("checkJoined", (room) => {
        let status;
        const user = getUserFromFilterSocketID(socket.id, "/game#");

        if (userToRoom[user._id] === room) {
          status = true;
          addUsertoRoom(user, socket, room);
          socket.join(room);
          
          const page = rooms[room].pageStatus;
          game.to(socket.id).emit("statusChange", page, null);
        } else {
          status = false;
        };

        game.to(socket.id).emit("isJoined", status);
      });

      socket.on("joinLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#");
        if(rooms[room]) {
          addUsertoRoom(user, socket, room);
          socket.join(room);
          console.log(`A player has joined room ${room}`, rooms[room], user._id);
          console.log(userToRoom[user._id])
        } else {
          game.to(socket.id).emit("isJoined", false)
        };
      });

      socket.on("changeStatus", (room, page) => {
        if (page === "lobby") {
          game.to(socket.id).emit("statusChange", page, null);
          changeReadyStatus(room, [socket.id], true);
        } else if (page === "game") {
          if(checkIfAllReady(room)) {
            game.to(room).emit("statusChange", page, null);
            const rules = logic.newRandomRule();
            game.to(room).emit("rules", rules);
            rooms[room][socket.id].isTurn = true;
            rooms[room].pageStatus = "game";
          };
        } else {
          game.to(room).emit("statusChange", page, null);
        };
      });

      socket.on("checkHost", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")
        if(rooms[room] && rooms[room][socket.id]) {
          if (rooms[room][socket.id].isHost) {
            game.to(socket.id).emit("newHost", true);
          }
        }
      })

      // use for playing the game
      socket.on("move", (index, hand, deck, rule) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")

        const room = userToRoom[user._id];

        const players = getListofPlayers(room);
        const checkifTurn = rooms[room][socket.id].isTurn;

        if (checkifTurn) {
          if (user) {
            console.log("Move received")
            const newState = logic.playerMove(index, hand, deck, rule);
            const newHand = newState[0];
            const newDeck = newState[1];
            const winner = newState[2];

            // Sets the next turn to the next player
            nextTurn(room, socket);

            if (winner) {
              const message = `${user._id} has won the game!`
              game.to(room).emit("statusChange", "winner", message);
              changeReadyStatus(room, players, false);
              rooms[room].pageStatus = "lobby";
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
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
