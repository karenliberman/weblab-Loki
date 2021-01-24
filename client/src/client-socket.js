import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

export const gamesocket = socketIOClient("/gameserver")

export const move = (index, hand, deck) => [
  gamesocket.emit("move", index, hand, deck)
]

export const join = () => {
  gamesocket.emit("join", "1");
};

export const test = () => {
  gamesocket.emit("test", "testingifworks")
}
