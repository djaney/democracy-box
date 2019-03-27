// Initializes the `Bill comments` service on path `/bill-comments`
const createService = require('feathers-mongoose');
const createModel = require('../../models/bill-comments.model');
const hooks = require('./bill-comments.hooks');


function mapFieldToData(fieldName) {
  return function(context){
    if(context.data && context.params.route[fieldName]) {
      context.data[fieldName] = context.params.route[fieldName];
    }
  };
}

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bill-comments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('bill-comments');

  // re-register as child
  app.use('/bills/:billId/comments', service);
  app.service('bills/:billId/comments').hooks({
    before: {
      find(context) {
        context.params.query.billId = context.params.route.billId;
      },
      create: mapFieldToData('billId'),
      update: mapFieldToData('billId'),
      patch: mapFieldToData('billId')
    }  
  });

  service.hooks(hooks);
};
