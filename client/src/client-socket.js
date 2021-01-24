import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

export const gamesocket = socketIOClient("/game")

export const move = (index, hand, deck) => [
  gamesocket.emit("move", index, hand, deck)
]

export const join = (room) => {
  gamesocket.emit("join", room);
  gamesocket.removeAllListeners();
};

export const test = (room) => {
  gamesocket.emit("test", "testingifworks", room)
};

export const leave = (room) => {
  gamesocket.emit("leave", room);
  gamesocket.removeAllListeners();
}
