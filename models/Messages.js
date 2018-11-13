var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var replySchema = new Schema({
  //id, text, created_on, delete_password, & reported.
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now() },
  delete_password: { type: String, default:''},
  reported: { type: Boolean, default: false}
});

var messageSchema = new Schema({
  board: { type: String, required: true },
  created_on: { type: Date, default: Date.now() },
  bumped_on: { type: Date, default: Date.now() },
  reported: {type: Boolean, default: false},
  text: { type: String, required: true },
  delete_password: {type: String, default:''},
  replies: [replySchema]
});
//Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
module.exports = mongoose.model('messages', messageSchema );