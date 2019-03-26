const assert = require('assert');
const app = require('../../src/app');
const rp = require('request-promise');
const host = app.get('host');
const port = app.get('port');

describe('\'Bills\' service', () => {
  before(function(done){
    this.server = app.listen(3030);
    this.server.once('listening', () => {
      const mongoose = app.get('mongooseClient');
      mongoose.connection.dropDatabase(done);
    });
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
});
