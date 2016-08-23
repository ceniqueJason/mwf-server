var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var projectSchema = new Schema({
  name: String,
  projectNo: String,
  description:String,
  address: String,
  type: String,
  assigned_date:{ type: Date, default: Date.now('YYYY-MM-DDT00:00:00Z')},
  start_date:Date,
  end_date:Date,
  staff:[String]
});

model = mongoose.model('Project', projectSchema);
Promise.promisifyAll(model);

module.exports = model
