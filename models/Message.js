var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  title: String,
  comments: Array  
});

module.exports = mongoose.model('messages', messageSchema );