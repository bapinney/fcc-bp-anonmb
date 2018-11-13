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

  suite('API ROUTING FOR /api/threads/:board', function() {
    var threadID2Use;
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
            assert.equal(res.statusCode, 200, "Status Code should be 200");
            assert.isNotNaN(new Date(res.body.created_on).getDate(), "Parsed date should not be NaN!");
            assert.isNotNaN(new Date(res.body.bumped_on).getDate(), "Parsed date should not be NaN!");
            assert.isFalse(res.body.reported, "The thread should not already be reported");
            assert.equal(res.body.board, 'testboard', 'Submission board should match');
            assert.equal(res.body.text, 'testtext', 'Submission text should match');
            assert.equal(res.body.delete_password, '313138', 'Delete password should match');

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
          console.log("get form a board response");
           console.dir(res.body[0]);
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
          thread_id: threadID2Use
        })
        .end(function(err, res) {
          console.log("DELETE STATUS");
          assert.equal(res.body.deleteStatus, 'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
