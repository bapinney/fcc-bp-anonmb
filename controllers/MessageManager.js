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
        console.log("resolving am promise");
        resolve(doc);
      }).catch(err => {
            console.error(err);
            reject(err);          
          })
      });
  }
  
  getMessages(board) {
    return new Promise((resolve, reject) => {
      console.log("getMessages called");
      console.dir(board);
      Messages.find({board: board}, function(err, docs) {
        if (err) {
          reject(err);
        }
        if (docs) {
          console.log("Got messages");
          console.dir(docs);
          resolve(docs);
        }
      });
    });
  }
  
  reply(obj) {
    console.log("Reply called!");
    console.dir(obj);
    return new Promise((resolve, reject) => {
      
      Messages.findOneAndUpdate({ _id: obj.thread_id, board: obj.board }, { 
        $push: { replies: {text: obj.text, delete_password: obj.delete_password}},
        $set:  { bumped_on: Date.now()}
        }, {new: true} ,function(err, doc) {
        if (err) { reject("Error replying to thread");}
        if (!doc) { reject("Cannot find thread to reply to");}
        resolve(doc);
      })
    });
  }
  
  delete(obj) {
    console.log("Delete called!");
    return new Promise((resolve, reject) => {
      Messages.findOne({ _id: obj.thread_id, board: obj.board}, function(err, doc) {
        if (doc) { 
          doc.remove(function(err) {
            if (err) { reject(err); }
            resolve("Success");
          });
        }
      });
    });
  }
  
  deleteReply(obj) {
    console.log("Delete thread called!");
    console.dir(obj);
    return new Promise((resolve, reject) => {
      Messages.findOne({ _id: obj.thread_id, board: obj.board}, function(err, doc) {
        if (doc) { 
          /*(doc.remove(function(err) {
            if (err) { reject(err); }
            resolve("Success");
          });( */
          var subdoc = doc.replies.id(obj.reply_id);
          console.log("doc found");
          console.dir(subdoc);
          var result = subdoc.remove();
          doc.save(function (err) {
            if (err) reject(err);
            resolve('Reply removed.');
          });
          
        }
      });
    });
  }
  
  reportReply(obj) {
    console.log("Report reply called!")
    return new Promise((resolve, reject) => {
      var msgsQ = { _id: ObjectId(obj.thread_id), board: obj.board};
      console.dir(msgsQ);
      Messages.findOne({ _id: obj.thread_id, board: obj.board}, function(err, doc) {
        if (err) { reject(err) }
        if (doc) { 
          var subdoc = doc.replies.id(obj.reply_id);
          subdoc.reported = true;
          doc.save(function (err) {
            if (err) reject(err);
            resolve("Reply reported");
          });
        }
        else {
          console.log("We shouldn't be here");
        }
      });
    });
  }
  
  report(obj) {
    console.log("Report called!");
    return new Promise((resolve, reject) => {
      console.dir(obj);
      Messages.findOne({ _id: ObjectId(obj.thread_id), board: obj.board }, {} , {new: true}, function (err, doc){
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