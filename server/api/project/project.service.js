var Project = require("./project.schema");
var Promise = require('bluebird');

module.exports = {
  find: function() {
    return Project.find()
  },
  findOne: function(query) {
    return Project.findOne(query)
  },
  create: function(body) {
    return Project.create(body)
  }
}