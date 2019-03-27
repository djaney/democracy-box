/* esline-disable no-console */
const assert = require('assert');
const app = require('../../src/app');
const rp = require('request-promise');
const host = app.get('host');
const port = app.get('port');

describe('\'Bill comments\' service', () => {
  before(function(done){
    this.server = app.listen(3030);
    this.server.once('listening', () => {
      app.get('mongooseClient').connection.dropDatabase(done);
    });
  });

  beforeEach(function(done){
    app.get('mongooseClient').connection.dropDatabase(done);
  });
  
  after(function (done) {
    this.server.close(done);
  });

  it('registered the service', () => {
    assert.ok(app.service('bill-comments'));
  });
  it('re-registered the service as child', () => {
    assert.ok(app.service('bills/:billId/comments'));
  });

  it('create comment', (done) => {
    let billId;
    app.service('bills').create({
      name: 'Test Bill',
      description: 'Test tes test',
      author: 'user1'
    }).then(bill => {
      billId = bill._id;
      return rp({
        url: `http://${host}:${port}/bills/${billId}/comments`,
        method: 'POST',
        body: {
          author: 'user2',
          text: 'This is a comment',
        },
        json: true
      });
    }).then(comment => {
      assert.equal(comment.billId, billId);
      assert.equal(comment.text, 'This is a comment');
      assert.equal(comment.author, 'user2');
    }).then(done).catch(done);
  });

  it('list comments', (done) => {
    let firstBillId;
    // create bill
    app.service('bills').create({
      name: 'Test Bill',
      description: 'Test tes test',
      author: 'user1'
    }).then(bill => {
      firstBillId = bill._id;
      // add comment 1
      return rp({
        url: `http://${host}:${port}/bills/${bill._id}/comments`,
        method: 'POST',
        body: {
          author: 'user2',
          text: 'This is a comment',
        },
        json: true
      }).then(() =>bill);
    }).then(bill => {
      // add comment 2
      return rp({
        url: `http://${host}:${port}/bills/${bill._id}/comments`,
        method: 'POST',
        body: {
          author: 'user3',
          text: 'This is a comment',
        },
        json: true
      }).then(() =>bill);
    }).then(bill => {
      // list down comments
      return rp({
        url: `http://${host}:${port}/bills/${bill._id}/comments`,
        method: 'GET',
        json: true
      }).then((bills) =>{
        assert.equal(bills.data.length, 2, 'added comments are listed');
      });
    }).then(() => {
      // create another bill
      return app.service('bills').create({
        name: 'Test Bill',
        description: 'Test tes test',
        author: 'user1'
      });
    }).then(bill => {
      // create comment for new bill
      return rp({
        url: `http://${host}:${port}/bills/${bill._id}/comments`,
        method: 'POST',
        body: {
          author: 'user2',
          text: 'This is a comment',
        },
        json: true
      });
    }).then(() => {
      // list down comments from fist bill
      return rp({
        url: `http://${host}:${port}/bills/${firstBillId}/comments`,
        method: 'GET',
        json: true
      }).then((bills) =>{
        assert.equal(bills.data.length, 2, 'added comments are listed except for comments in separate bill');
      });
    }).then(done).catch(done);
  });
});
