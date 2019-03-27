// Bill comments-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const billComments = new Schema({
    billId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    author: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('billComments', billComments);
};
