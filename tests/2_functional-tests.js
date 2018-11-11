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
    
    suite('POST', function() {
      test('Post to a board', function(done) {
         chai.request(server)
          .post('/api/threads/testboard')
          .send({
            board: "testboard",
            text: "testtext",
            delete_password: 123654
          })
          .end(function(err, res) {
            console.log("At end res048944");
            console.dir(res);
            console.dir(res.body);
           
/*
            //fill me in too!
            assert.isTrue(res.body.issueCreated, "Issue Created is true!");
            assert.isNotNaN(new Date(res.body.result.created_on).getDate(), "Parsed date should not be NaN!");
            assert.isNotNaN(new Date(res.body.result.updated_on).getDate(), "Parsed date should not be NaN!");
            assert.isTrue(res.body.result.open);
            assert.equal(res.body.result.title, 'Functional Test - Every field filled in');
            assert.equal(res.body.result.text, 'text');
            assert.equal(res.body.result.created_by, 'Bob');
            assert.equal(res.body.result.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.result.status_text, "In QA");
            */
            done(); 
          });
        });
    });
    
    suite('GET', function() {
      test('Get from a board', function(done) {
         chai.request(server)
          .post('/api/threads/testboard')
          .send({
            board: "testboard",
            text: "testtext",
            delete_password: 123654
          })
        .end(function(err, res) {
            console.log("At end res048944");
            console.dir(res.body);
            assert.equal(res.statusCode, 200);
           
/*
            //fill me in too!
            assert.isTrue(res.body.issueCreated, "Issue Created is true!");
            assert.isNotNaN(new Date(res.body.result.created_on).getDate(), "Parsed date should not be NaN!");
            assert.isNotNaN(new Date(res.body.result.updated_on).getDate(), "Parsed date should not be NaN!");
            assert.isTrue(res.body.result.open);
            assert.equal(res.body.result.title, 'Functional Test - Every field filled in');
            assert.equal(res.body.result.text, 'text');
            assert.equal(res.body.result.created_by, 'Bob');
            assert.equal(res.body.result.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.result.status_text, "In QA");
            */
            done(); 
          });
        });
        
        
        
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
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
