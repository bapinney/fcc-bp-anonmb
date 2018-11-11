/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MessageManager = require('../controllers/MessageManager');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get(function(req, res) {
    console.log("at get999");
    console.dir(req);
    
    var mm = new MessageManager();
    mm.getMessages(req.params.board)
    .then(function(docs) {
      console.log("At thead then");
      console.dir(docs);
      res.json(docs);
    })
    .catch(function (err) {
      res.json(err);
    });
    
  })
  .post(function(req, res) {
    console.dir(req);
//    var message = new Message(req.body);
    console.log("Api reply post");
    var mm = new MessageManager();
    mm.addMessage({
      /*project: req.params.project,
      title: req.body.issue_title,
      text: req.body.issue_text,
      created_by: req.body.created_by,
      assigned_to: req.body.assigned_to,
      status_text: req.body.status_text 
  board: { type: String, required: true },
  created_on: { type: Date, default: createDate },
  bumped_on: { type: Date, default: createDate },
  reported: {type: Boolean, default: false},
  text: { type: String, required: true },
  deletePassword: {type: String, default:''},
  replies: { type: Array, default:[], required: true },*/
      board: req.params.board,
      text: req.body.text,
      deletePassword: req.body.delete_password
    })
    .then(function(result) { 
      console.log("then result");
      console.dir(result);
      res.redirect('/b/' + req.params.board);
    }, function (error) { 
      console.log("Error adding message");
      console.dir(error);
      res.status(500).json({messageCreated: false, status:"Error creating message."}) });
  })
  .put(function(req, res) { // Put to api/threads/board is a report on that thread
    var mm = new MessageManager();
    console.log("PUT called!");
    console.dir(req);
    mm.report(req.body)
    .then(function(doc) { res.send("Message reported"); return true;})
    .catch(function(err) { 
      res.status(500).send("error: " + err); 
      return false; 
    })
  })
  .delete(function(req, res) {
    var mm = new MessageManager();
    console.log("Delete called");
    var deleteParams = Object.assign({}, req.body, req.params);
    mm.delete(deleteParams)
    .then(function(doc) { res.send("Thread Deleted"); return true;})
    .catch(function(err) {
      res.status(500).send("error: " + err);
    });
  });
    
  app.route('/api/replies/:board')
  .post(function(req, res) {
    var mm = new MessageManager();
    console.dir(req.body);
    console.dir(req.params);
    var replyParams = Object.assign({}, req.body, req.params);
    mm.reply(replyParams)
    .then(function(doc) {
      res.redirect('/b/' + req.params.board);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
  })
  .put(function(req, res) {
    var mm = new MessageManager();
    console.dir(req);
    mm.reportReply(req.body)
    .then(function(doc) {
      res.json(doc);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
  })
  .delete(function(req, res) {
    var mm = new MessageManager();
    console.log("Delete reply");
    console.dir(req);
    mm.deleteReply(req.body)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
    //mm.delete()
  });

};

