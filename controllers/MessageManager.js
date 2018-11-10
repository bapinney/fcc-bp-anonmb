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
  
  report(obj) {
    console.log("Report called!");
    return new Promise((resolve, reject) => {
      console.dir(obj);
      Messages.findOne({ _id: obj.thread_id, board: obj.board }, {} , {new: true}, function (err, doc){
        if (err) { reject(process.env.NODE_ENV == "test" ? err: "Error updating message"); }
        if (!doc) { reject(process.env.NODE_ENV == "test" ? err: "Cannot find message to update"); }
        else {
          doc.reported = true;
          doc.save(function(err, message){
            if (err) { reject(process.env.NODE_ENV == "test" ? err: "Error updating message"); }
            if (message) { 
              console.log("We got a message on save");
              console.dir(message);
              resolve(message); 
            }
          });
        }
      }); 
    });
  }
}

module.exports = MessageManager;