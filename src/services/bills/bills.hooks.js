const common = require('feathers-hooks-common');

function populateRoot(context){
  if(context.data.parent){
    const billsService = context.app.service('bills');
    return billsService.get(context.data.parent).then((parentBill) => {
      if(parentBill.root){
        context.data.root = parentBill.root;
      }else{
        context.data.root = parentBill._id;
      }
      return context;
    }); 
  }
}
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [common.discard('root'), populateRoot],
    update: [common.disallow('extenral')],
    patch: [common.disallow('extenral')],
    remove: [common.disallow('extenral')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};