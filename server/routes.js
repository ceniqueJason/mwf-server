var path = require('path');
var express = require('express');

require("./api/project/project.route.js");

app.use(express.static(path.join(rootPath, "../public")))