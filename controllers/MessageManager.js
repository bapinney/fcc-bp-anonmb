const Messages = require("../models/Messages.js");

var mongodb = require("mongodb");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var client = mongodb.MongoClient;

class MessageManager {
  addMessage(obj) {
    return new Promise((resolve, reject) => {
      
      console.log("addMessage called.");
      //console.dir(obj);
      if (!obj.board) reject("Board field is required");
      if (!obj.text) reject("Message body is empty");
      var message = new Messages(obj);
      message.save().then(function(doc) {
        var retObj = doc;
        console.log("Resolving add message");
        resolve(retObj);
      })
      .catch(function(err) {
        console.error(err);
        reject(err);          
      }) 
    });
  } 
  
  getMessages(board) {
    return new Promise((resolve, reject) => {
      console.log("getMessages called");
      //console.dir(board);
      Messages.find({board: board}).sort({bumped_on: -1}).limit(10).exec(function(err, docs) {
        if (err) {
          reject(err);
        }
        if (docs) {
          console.log("Got messages");
          resolve(docs);
        }
      });
    });
  }
  
  getReplies(board) {
    return new Promise((resolve, reject) => {
      console.log("getreplies called");
      //console.dir(board);
      Messages.find({board: board}).sort({bumped_on: -1}).limit(10).exec(function(err, docs) {
        if (err) {
          reject(err);
        }
        if (docs) {
          console.log("Got messages");
          resolve(docs);
        }
      });
    });
  };
  
  reply(obj) {
    console.log("Reply called!");
    //console.dir(obj);
    return new Promise((resolve, reject) => {
      
      Messages.findOneAndUpdate({ _id: obj.thread_id, board: obj.board }, { 
        $push: { replies: {
          $each: [{text: obj.text, delete_password: obj.delete_password, created_on: Date.now()}],
          $sort: {created_on: -1}
        }}}, {new: true} ,function(err, doc) {
        if (err) { reject("Error replying to thread");}
        if (!doc) { reject("Cannot find thread to reply to");}
        resolve(doc);
      })
    });
  }
  
  delete(obj) {
    console.log("Delete called!");
    console.dir(obj);
    return new Promise((resolve, reject) => {
      if (!obj.hasOwnProperty('delete_password')) {
        reject("Password required to delete");
        return false;
      }
      Messages.findOne({ _id: obj.thread_id, board: obj.board}, function(err, doc) {
        console.log("mf1 callback"); 
        console.dir(err); 
        if(!doc) {
          reject("Thread not found");
          return false;
        }
        console.dir(doc._doc); //Check password is correct
        if (obj.delete_password !== doc._doc.password) {
          console.log("Incorrect password");
          reject("Incorrect password"); 
        }
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
    console.log("Delete reply called!");
    
    return new Promise((resolve, reject) => {
      Messages.findOne({ _id: obj.thread_id}, function(err, doc) {
        if (doc) { 
          /*(doc.remove(function(err) {
            if (err) { reject(err); }
            resolve("Success");
          });( */
          var subdoc = doc.replies.id(obj.reply_id);
          doc.replies.pull(subdoc);
          doc.save(function (err) {
            if (err) reject(err);
            console.log("resolving reply remove");
            resolve('Reply removed.');
          });
          
        }
      });
    });
  }
  
  reportReply(obj) {
    console.log("Report reply called!")
    console.dir(obj);
    return new Promise((resolve, reject) => {
      var msgsQ = { _id: ObjectId(obj.thread_id)};
      console.dir(msgsQ);
      Messages.findOne({ _id: obj.thread_id}, function(err, doc) {
        if (err) { reject(err) }
        if (doc) { 
          var subdoc = doc.replies.id(obj.reply_id);
          console.log("here is subdoc");
          console.dir(subdoc._doc);
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