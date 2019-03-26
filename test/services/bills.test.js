/* esline-disable no-console */
const assert = require('assert');
const app = require('../../src/app');
const rp = require('request-promise');
const host = app.get('host');
const port = app.get('port');

describe('\'Bills\' service', () => {
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
    const service = app.service('bills');
    assert.ok(service, 'Registered the service');
  });

  it('validations', (done) => {
    rp({
      url: `http://${host}:${port}/bills`,
      method: 'POST',
      body: {
        name: 'Bill Name',
        description: 'Some description',
        author: 'mrtest'
      },
      json: true
    }).then(body => {
      assert.equal('Bill Name', body.name);
      assert.equal('Some description', body.description);
      assert.equal('mrtest', body.author);
    }).then(() => {
      return rp({
        url: `http://${host}:${port}/bills`,
        json: true
      }).then((body) => {
        assert(body.data.length, 1);
      });
    }).then(done).catch(done);
  });

  it('root and parent fields', (done) => {
    let firstId, secondId;
    // create first bill
    rp({
      url: `http://${host}:${port}/bills`,
      method: 'POST',
      body: {
        name: 'Bill Name',
        description: 'Some description',
        author: 'mrtest'
      },
      json: true
    }).then(body => {
      firstId=body._id;
    }).then(() => {
      //create second bill
      return rp({
        url: `http://${host}:${port}/bills`,
        method: 'POST',
        body: {
          name: 'Bill Name 2',
          description: 'Some description',
          author: 'mrtest',
          parent: firstId
        },
        json: true
      });
    }).then( (body) => {
      secondId = body._id;
      assert(body.parent, firstId);
      assert(body.root, firstId);
    }).then(() =>{
      // create third bill
      return rp({
        url: `http://${host}:${port}/bills`,
        method: 'POST',
        body: {
          name: 'Bill Name 3',
          description: 'Some description',
          author: 'mrtest',
          parent: secondId
        },
        json: true
      }).then((body) => {
        // root should be the id of the first 
        // parent should be the id of the second
        assert(body.parent, secondId);
        assert(body.root, firstId);
      });
    }).then(() => {
      return rp({
        url: `http://${host}:${port}/bills`,
        json: true
      }).then((body) => {
        console.log(body);
      });
    })
    
    .then(done).catch(done);
  });

});
