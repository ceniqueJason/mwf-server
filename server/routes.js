var path = require('path');
var express = require('express');

require("./api/project/project.route.js");
require("./api/user/user.route.js");
require("./api/super_user/super_user.route.js");
require("./api/user/user_crud.route.js");


app.use(express.static(path.join(rootPath, "../public")))
