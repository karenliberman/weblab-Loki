import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

export const gamesocket = socketIOClient("/game")

export const move = (index, hand, deck) => {
  console.log("Move detected");
  gamesocket.emit("move", index, hand, deck);
}

export const createLobby = (room) => {
  gamesocket.emit("createLobby", room);
  gamesocket.removeAllListeners();
};

export const joinLobby = (room) => {
  gamesocket.emit("joinLobby", room);
  gamesocket.removeAllListeners();
}

export const test = (room) => {
  gamesocket.emit("test", "testingifworks", room)
};

export const leave = (room) => {
  gamesocket.emit("leave", room);
  gamesocket.removeAllListeners();
};

export const startGame = (room) => {
  gamesocket.emit("startGame", room);
};

export const returnLobby = (room) => {
  gamesocket.emit("returnLobby", room);
}
