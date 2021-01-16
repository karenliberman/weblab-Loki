/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Deck = require("./models/deck");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});


// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.post("/deck", (req, res) => {
  if (req.body.action === "create") {
    const deck = new Deck({
      gameId: 1,
      cards: req.body.cards
    });

    deck.save().then((data) => res.send(data)).catch((err) => console.log(err));
  } else if (req.body.action === "update") {
    Deck.findOne({}).then((deck) => {
      deck.cards = req.body.cards;
      deck.save().then((deck) => res.send(deck));
    })
  } else if (req.body.action === "delete") {
    Deck.deleteOne({gameId: 1}).then((deck) => {
      res.send(deck);
    })
  }
})

router.get("/deck", (req, res) => {
  Deck.find({}).then((deck) => res.send(deck))
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
