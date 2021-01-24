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
      
    });
    // listens for any message from the client inside game and lobby
    game.on("connection", (socket) => {
      // leaving rooms
      socket.on("disconnect", (reason) => {
        let socketid = socket.id;
        socketid = socketid.replace("/gameserver#", "");

        const user = getUserFromSocketID(socketid);

        removeUserfromRoom(user, "1");
        socket.leave("1");
        console.log("leave", rooms["1"], user._id)
      });

      // testing purposes
      socket.on("test", (test) => {
        console.log(test);
        game.to("1").emit("testping", "testping");
      })

      // for joining/creating room
      socket.on("join", (room) => {
        let socketid = socket.id;
        socketid = socketid.replace("/gameserver#", "");

        const user = getUserFromSocketID(socketid);

        addUsertoRoom(user, "1");
        socket.join("1");
        console.log("join", rooms["1"][0], user._id);
      });

      // use for playing the game
      socket.on("move", (index, hand, deck, rule) => {
        let socketid = socket.id;
        socketid = socketid.replace("/gameserver#", "");

        const user = getUserFromSocketID(socketid);

        if (user) {
          const newState = logic.playerMove(index, hand, deck, rule);
          const newHand = newState[0];
          const newDeck = newState[1];
          const winner = newState[2];
          
          if (winner) {
            const message = `${user._id} has won the game!`
            io.emit("winner", message, user);
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
