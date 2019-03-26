// Initializes the `Bills` service on path `/bills`
const createService = require('feathers-mongodb');
const hooks = require('./bills.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/bills', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bills');

  mongoClient.then(db => {
    service.Model = db.collection('bills');
  });

  service.hooks(hooks);
};
