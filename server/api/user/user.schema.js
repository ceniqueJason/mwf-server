var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var userSchema = new Schema({
  staffID: String,
  sPassword: String
});

model = mongoose.model('User', userSchema);
Promise.promisifyAll(model);

module.exports = model
