var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var createDate = Date.now();
var messageSchema = new Schema({
  board: { type: String, required: true },
  created_on: { type: Date, default: createDate },
  bumped_on: { type: Date, default: createDate },
  reported: {type: Boolean, default: false},
  text: { type: String, required: true },
  deletePassword: {type: String, default:''},
  replies: { type: Array, default:[]},
});
//Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
module.exports = mongoose.model('messages', messageSchema );