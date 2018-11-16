/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

 
chai.use(chaiHttp);

suite('Functional Tests', function() { 
  var threadID2Use;
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Post to a board', function(done) {
         chai.request(server)
          .post('/api/threads/testboard')
          .send({
            board: "testboard",
            text: "testtext",
            delete_password: 313139
          })
          .end(function(err, res) {
            assert.isNull(err, "POST to board did not result in an error");
            console.log("Post to a board result...");
            console.dir(res.body);
            assert.equal(res.statusCode, 200, "Status Code should be 200");
            assert.isNotNaN(new Date(res.body.created_on).getDate(), "Parsed date should not be NaN!");
            assert.isNotNaN(new Date(res.body.bumped_on).getDate(), "Parsed date should not be NaN!");
            assert.isFalse(res.body.reported, "The thread should not already be reported");
            assert.equal(res.body.board, 'testboard', 'Submission board should match');
            assert.equal(res.body.text, 'testtext', 'Submission text should match');
            assert.equal(res.body.delete_password, '313139', 'Delete password should match');

            threadID2Use = res.body._id;
            done(); 
          });
        });
    });
    suite('GET', function() {
      test('Get from a board', function(done) {
         chai.request(server)
          .get('/api/threads/testboard')
          .end(function(err, res) {
          console.log("get form a board response.  ThreadID was " + threadID2Use);
           //console.dir(res.body[0]);
           assert.isArray(res.body);
           assert.equal(res.body[0]._id, threadID2Use);
           assert.equal(res.body[0].text, 'testtext');
          done(); 
        });
      }); 
    });
    
    suite('PUT', function() {
      test("PUT a thread", function(done) {
        chai.request(server)
        .put('/api/threads/testboard')
        .send(
          {board: 'testboard',
           thread_id: threadID2Use
          }
        )
        .end(function(err, res) {
          if (err) console.log("There was an error using PUT");
          assert.isNull(err, "There should not be an error after PUT");
          console.log("put responseeee");
          assert.isTrue(res.body.reported);
          done();
        })
      });
    });
    
    suite('DELETE', function() {
      test("DELETE a thread", function(done) {
        chai.request(server)
        .delete('/api/threads/testboard')
        .send({
          board: 'testboard',
          thread_id: threadID2Use,
          delete_password: 313138
        })
        .end(function(err, res) {
          console.log("DELETE STATUS");
          if (err) {
            console.log("There was an error.  ThreadID was "+ threadID2Use); 
          }
          
          assert.equal(res.body.error, "Incorrect password");
          assert.equal(res.body.deleteStatus, 'fail', "The password used to delete was not the correct password, so the delete should not succeed");
          chai.request(server)
          .delete('/api/threads/testboard')
          .send({
            board: 'testboard',
            thread_id: threadID2Use,
            delete_password: 313139
          })
          .end(function(err, res) {
            console.log("delete success"); 
            assert.isNotNull(err, "There should be an error!");
            done();
          });
          
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    var newerThreadID;
    var replyCheckTS;
    var replyDeleteID;
    
    suite('POST', function() {
      test("POST a reply", function(done) {  //We'll need a new thread ID since we deleted the last one at this point....
        console.log("POST a reply test running...");
        
        chai.request(server)
          .post('/api/threads/testboard')
          .send({
            board: "testboard",
            text: "reply to me",
            delete_password: 313138
          })
          .then(function(res) {
            newerThreadID = res.body._id;
            chai.request(server)
            .post('/api/replies/testboard')
            .send({
              thread_id: newerThreadID,
              text: "I think I will",
              delete_password: 313138 
            })
            .end(function(err, res) {
              console.log("At POST 2 reply then");  
              assert.typeOf(res.body.replies, "array", "Replies is an array");
              assert.equal(res.body.replies[0].text, "I think I will");
              replyCheckTS = res.body.replies[0].created_on;
              done();
            });
          });
        });
    });
    
    suite('GET', function() {
      console.log("GET REPLIES1!");
      test("GET replies", function(done) {
        chai.request(server)
        .get('/api/replies/testboard')
        .then(function(res) {
          assert.equal(res.body[0].replies[0].created_on, replyCheckTS, "We should see the reply we just made");
          console.log("DIRing reply");
          replyDeleteID = res.body[0].replies[0]._id;
          done();
        });
        
      });
    });
    
    suite('PUT', function() { 
      test("PUT reply", function(done) {
        console.log("Here is what we are putting");
        console.dir({ reply_id: replyDeleteID, thread_id: newerThreadID });
        chai.request(server)
        .put('/api/replies/testboard')
        .send({ reply_id: replyDeleteID, thread_id: newerThreadID })
        .then(function(res) {
          chai.request(server)
          .get('/api/replies/testboard')
          .then(function(res) {
            assert.isTrue(res.body[0].replies[0].reported, "We should see the reply we just reported");
            done();
          });
        });
        
      });
    });
    
    suite('DELETE', function() {
      test("DELETING reply", function(done) {
        console.log("Here is what we are deleting");
        console.dir({ reply_id: replyDeleteID, thread_id: newerThreadID });
        chai.request(server)
        .delete('/api/replies/testboard')
        .send({ reply_id: replyDeleteID, thread_id: newerThreadID, delete_password: 31318})
        .then(function(res) {
          console.log("del result");
          assert.equal(res.body.replyDeleted, true);
          done();
        });
        
      });
    }); 
  });
})