var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var userSchema = new Schema({
  cid: String,
  sid: String,
  email: String,
  password: String,
  chiname: String,
  engname: String,
  role: String,
  iBeaconNo: String,
  department: String,
  worktype: String,
  gender: String,
  contactno: String,
  birthday: Date,
  employment_date: Date,
  projectno:[String]
});

model = mongoose.model('User', userSchema);
Promise.promisifyAll(model);

module.exports = model
