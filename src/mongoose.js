const mongoose = require('mongoose');

module.exports = function () {
  const app = this;
  const config = app.get('mongodb');
  mongoose.connect(config, {useNewUrlParser: true});
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
