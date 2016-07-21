var ProjectServ = require("./project.service");

app.get("/", function(req, res){
  res.send("Hello World")
});

app.get("/api/projects", function(req, res) {
  ProjectServ
    .find()
    .then(function(result){
      res.send(result);
    })
    .catch(function(err){
      res.status(500).send(err);
    })
});

app.get("/api/projects/:id", function(req, res) {
  var query = { _id: req.params.id };
  ProjectServ
    .findOne(query)
    .then(function(result){
      res.send(result);
    })
    .catch(function(err){
      res.status(500).send(err);
    })
});

app.post("/api/projects", function(req, res) {
  ProjectServ
    .create(req.body)
    .then(function(result){
      res.send(result);
    })
    .catch(function(err){
      res.status(500).send(err);
    })
});

app.put("/api/projects/:id", function(req, res) {
  res.send("Update");
});

app.delete("/api/projects/:id", function(req, res) {
  res.send("Delete");
});