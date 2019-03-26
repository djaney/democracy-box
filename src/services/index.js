const bills = require('./bills/bills.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(bills);
};
