var User = require("./user.schema");
var Promise = require('bluebird');

module.exports = {
  find: function() {
    return User.find()
  },
  finds: function(query) {
    return User.find(query)
  },
  findOne: function(query) {
    return User.findOne(query)
  },
  create: function(body) {
    return User.create(body)
  },
  remove: function(id){
    return User.remove(id)
  },
  count: function(){
    return new Promise(function(resolve, reject){
      User.count({}, function(err, c){
        if (err) {
          return reject(err)}
        else{
          resolve(c)}
      })
    })
  },
  sort: function(){
    return User.find({},{sid:1}).sort({sid:-1}).limit(1)
  },
  update: function(body,body2){
    return User.update(body,body2)
  }
}
