// App
var express = require('express');
global.app  = express();

// Libs
var cors          = require('cors');
var path          = require('path');
var Promise       = require('bluebird');
var mongoose      = require('mongoose');
var bodyParser    = require('body-parser');
mongoose.Promise  = global.Promise

// Cors
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Paths
global.rootPath   = __dirname;
global.configPath = path.join(__dirname, "../config.json");

var serverConnection = function() {
  return new Promise(function(resolve, reject) {
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
      resolve();
    });
  });
}

var databaseConnection = function() {
  return new Promise(function(resolve, reject) {
    require("./components/db/mongo.db")
      .connect()
      .then(function(){
        resolve();
      })
  });
}

Promise
  .all([serverConnection(), databaseConnection()])
  .then(function() {
    require("./routes.js");
  });
