const Messages = require("../models/Messages.js");

var mongodb = require("mongodb");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var client = mongodb.MongoClient;

class MessageManager {
  addMessage(obj) {
    return new Promise((resolve, reject) => {
      
      console.log("addMessage called.");
      console.dir(obj);
      if (!obj.board) reject("Created By field is required");
      if (!obj.text) reject("Message body is empty");
      var message = new Messages(obj);
      message.save().then(doc => {
        resolve(doc);
      }).catch(err => {
            console.error(err);
            reject(err);          
          })
      });
  }
}

module.exports = MessageManager;