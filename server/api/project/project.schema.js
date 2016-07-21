var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var projectSchema = new Schema({
  name: String,
  type: String
});

model = mongoose.model('Project', projectSchema);
Promise.promisifyAll(model);

module.exports = model