const feathers = require('feathers');
const assert = require('assert');

const memory = require('feathers-memory');
const hooks = require('../../src/services/bills/bills.hooks');



describe('\'Bills\' service', () => {
  let app;
  beforeEach(() => {

    // setup service
    app = feathers();
    app.configure(require('feathers-hooks')());
    app.use('/bills', memory({
      paginate: {
        default: 10,
        max: 50
      }
    }));

    app.service('bills').hooks(hooks);
  });

  it('registered the service', () => {
    const service = app.service('bills');
    assert.ok(service, 'Registered the service');
  });

  it('creates bill', (done) => {
    app.service('bills').create({name: 'Bill number 1'})
      .then(bill => {
        assert.ok(bill);
        assert.equal(bill.name, 'Bill number 1');
      }).then(done).catch(done);
  });
  
});