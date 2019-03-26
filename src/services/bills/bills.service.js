// Initializes the `Bills` service on path `/bills`
const createService = require('feathers-mongoose');
const createModel = require('../../models/bills.model');
const hooks = require('./bills.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bills',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bills', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bills');

  service.hooks(hooks(app));
};
