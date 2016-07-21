var config    = require(configPath);
var Promise   = require('bluebird');
var mongoose  = require('mongoose');

var options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: config.database.connection.timeout * 1000
    }
  }
}

module.exports = {
  connect: function() {
    return new Promise(function(resolve, reject) {
      var dbConfig  = config.database.connection;
      var hosts     = "";

      Promise
        .each(config.database.hosts, function(host){
          return new Promise(function(reso, reje) {
            hosts += `${host.address}:${host.port},`;
            reso()
          });
        })
        .then(function() {
          hosts = hosts.substring(0, hosts.length - 1);
          mongoose.connect(`mongodb://${hosts}/${config.database.name}`, options);
          var conn = mongoose.connection
          conn.once('open', function(){
            resolve();
          })
          conn.on('error', function(err){
            reject(err);
          })
        })
    });
  }
}