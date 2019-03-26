const MongoClient = require('mongodb').MongoClient;

module.exports = function () {
  const app = this;
  const config = app.get('mongodb');
  const promise = MongoClient.connect(config.url, {useNewUrlParser: true}).then(db => db.db(config.db));

  app.set('mongoClient', promise);
};
