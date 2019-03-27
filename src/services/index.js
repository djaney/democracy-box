const bills = require('./bills/bills.service.js');
const billComments = require('./bill-comments/bill-comments.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(bills);
  app.configure(billComments);
};
