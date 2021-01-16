const mongoose = require("mongoose");

const HandSchema = new mongoose.Schema({
  playerId: String,
  parent: String,
  cards: Array,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);