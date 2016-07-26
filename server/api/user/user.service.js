var User = require("./user.schema");
var Promise = require('bluebird');

module.exports = {
  find: function() {
    return User.find()
  },
  findOne: function(query) {
    return User.findOne(query)
  },
  create: function(body) {
    return User.create(body)
  }

}
