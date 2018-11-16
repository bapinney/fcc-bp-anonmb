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
            delete_password: 313138
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
            delete_password: 313138
          })
          .end(function(err, res) {
            console.log("delete success"); 
            assert.isNotNull(null, "There should be an error!");
            done();
          });
          
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    var newerThreadID;
    
    suite('GET', function() {
      console.log("GET REPLIES1!");
      test("GET replies", function(done) {
        console.log("get replies test");  
        assert.isTrue(true);
        done();
      });
    });
    
    suite('POST', function() {
      test("POST a reply", function(done) {  //We'll need a new thread ID since we deleted the last one at this point....
        console.log("POST a reply test running...");
        done();
        chai.request(server)
          .post('/api/threads/testboard')
          .send({
            board: "testboard",
            text: "reply to me",
            delete_password: 313138
          })
        .end(function(err, res) {
          assert.isNull(err, "There should be no err after post");
          assert.isNotNull(res.body._id, "We should have a thread id");
          newerThreadID = res.body._id;
          done();
//          request2();
        });
        var request2 = function() {
          chai.request(server)
          .post('/api/replies/testboard')
          .send({
            thread_id: newerThreadID,
            text: "I think I will",
            delete_password: 313138
          })
          .end(function(err, res) {
            console.log("At POST reply then");  
            assert.typeOf(res.body.replies, "array", "Replies is an array");
            assert.equal(res.body.replies[0].text, "I think I will");
            done();
          });
        };
      });
    });
    
    suite("pls work", function() {
      test('pls1', function(done) {
        console.log("foo");
      })
    });
     
    suite('PUT', function() { 
      test("PUT should be last", function(done) {
        assert.equal(true, "i hope so!");
        console.log("me too!");
        done();
      });
    });
    
    suite('DELETE', function() {
      
    }); 
  });
}) 