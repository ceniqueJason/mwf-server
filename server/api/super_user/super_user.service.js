var company = require("./company.schema");
var Promise = require('bluebird');

module.exports = {
  find: function() {
    return company.find({})
  },
  finds: function(query) {
  if((query.chiname==undefined||query.chiname==null)&&(query.engname==undefined||query.engname==null)){
    return company.find(query)
  }
  else{
    return company.find(query).sort({name:1})
  }},
  findOne: function(query) {
      return company.findOne(query)
  },
  create: function(body) {
    return company.create(body)
  },
  remove: function(id){
    return company.remove(id)
  },
  count: function(){
    return new Promise(function(resolve, reject){
      company.count({}, function(err, c){
        if (err) {
          return reject(err)}
        else{
          resolve(c)}
      })
    })
  },
  sort: function(){
    return company.find({},{id:1}).sort({id:-1}).limit(1)
  },
  update: function(body,body2){
    return company.update(body,body2)
  },
  upsert: function(body,body2){
    return company.update(body,body2)
  }
}
