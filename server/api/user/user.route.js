var UserServ = require("./user.service");

app.post("/api/users/register", function(req, res) {
  var useradd = req.body;

  var query = {staffID: useradd.staffID};
  UserServ
    .findOne(query)
    .then(function(result){
      if(result == null){
        UserServ
          .create(req.body)
          .then(function(){
            // res.write('OK ---------' + result);
            res.send('Your registry has been done successfully');
            // res.end();
          })
          .catch(function(err){
            res.status(500).send('Error :' + err);
          })
      }else{
        // res.write('Not OK ---------' + result);
        // res.append('Sorry, user already exists!');
        res.status(500).send('Sorry, user already exists!');
      }
    })
    .catch(function(err){
      res.status(500).send('Error :' + err);
      res.end();

    })
});

app.get("/api/users/login", function(req, res) {

  var userDetail = req.body;

  /**
  {
      name: "John",
      username: "john",
      password: "123"
  }
  **/

  userDetail.name;

  UserServ
    .findOne(req.body)
    .then(function(result){
      res.send("OK"+" space "+result);
    })
    .catch(function(err){
      res.status(500).send(err);
    })
});
