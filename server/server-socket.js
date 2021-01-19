let io;
let game;
const logic = require("./logic.js")

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

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
    game = io.of("/gameserver");

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      // Listens for any card placement done by the client
      socket.on("move", (index, hand, deck) => {
        const user = getUserFromSocketID(socket.id);
        if (user) {
          const newState = logic.playerMove(index, hand, deck);
          const newHand = newState[0];
          const newDeck = newState[1];
          const winner = newState[2];
          
          if (winner) {
            io.emit("winner", `${user._id} has won the game!`);
          } else {
            io.emit("update", newHand, newDeck, user);
          }
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
    //     const user = getUserFromSocketID(socket.id);
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
