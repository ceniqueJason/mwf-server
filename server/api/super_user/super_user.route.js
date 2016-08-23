var dateFormat = require('dateformat');
var Promise = require('bluebird');
var SuperUserServ = require("./super_user.service");


function getcountstring(result){//split the max id string into an integer
  var result2 = JSON.stringify(result);
  var substring = result2.substring(result2.indexOf('\"c')+2,result2.lastIndexOf('\"'));
  var number = parseInt(substring);
  number = getcount(number+1);//new id = current max id+1
  return number;
}


function getcount(count){//generate company id
  if(count<10){
    var cid = 'c'+'000'+count;
  }else if(count<100){
    var cid = 'c'+'00'+count;
  }else if(count<1000){
    var cid = 'c'+'0'+count;
  }else{
    var cid = 'c'+count;
  }
  return cid;
}


function deptsize(department){//calculate deptid/deptn size in object/string
  var size;
  if(typeof department == 'object'){
    size = Object.keys(department).length;
  }else{//if string
    size=-1;
  }
  return size;
}

function embeddedmaker(department){//functionid:1 ==insert functionid:2 ==update functionid:3 ==query
  var update = {$set:{}};
  var size=new Array();
  size=deptsize(department);
  var n = 0;//no. of object
  for(i=0;i<size;i++){
    if(department[i].deptid==undefined || department[i].deptid==''){
      continue;
    }else{
      update.$set['department.'+n+'._id'] = department[i].deptid;
      if(department[i].deptn==undefined){
      update.$set['department.'+n+'.name'] = "";
    }else{
      update.$set['department.'+n+'.name'] = department[i].deptn;
    }
      n++;
      }
  }
    console.log('update '+JSON.stringify(update));
  return update;
}


app.post("/api/company/insert", function(req, res) {
  var company = req.body;
  console.log(JSON.stringify(company));
  var query = {$or:[{chiname: company.chiname},{engname:company.engname}]};
  SuperUserServ
  .findOne(query)//find if the chi/engname used
  .then(function(qresult){
    if(qresult == null){
        SuperUserServ
        .sort()//get maximum id in db
        .then(function(result){
          if(result.length>0){
            var cid = getcountstring(result);
          }else{
            var cid = 'c0001';
          }
        //  var day = dateFormat(new Date(), "isoDate");
          var cstatus = 'Active';

          var create = {id: cid,chiname: company.chiname,engname:company.engname,code: company.code,
          status: cstatus,description: company.description};//create command
               SuperUserServ
              .create(create)//insert
              .then(function(result){
                        var update2 = embeddedmaker(company.department);
                        SuperUserServ
                        .update(query,update2)
                        .then(function(result){
                          res.status(201).send("New company added");
                        }).catch(function(err){
                          res.status(500).send('Error: '+err);
                        })
              }).catch(function(err){
                  res.status(500).send('Error: '+err);
              })
          }).catch(function(err){
              res.status(500).send('Error: '+err);
          })
      }else{
          res.status(500).send("Company name Already Exists");
      }
  }).catch(function(err){
    res.send('Error: '+err);
  })
});


app.patch("/api/company/update", function(req, res) {
  var company = req.body;
  console.log(company);
  var query = {id:company.id};
  var queryname = {$and:[{$or:[{chiname:company.chiname},{engname:company.engname}]},{id:{$ne:company.id}}]};
//To avoid the new name which is used but not include the current company
  var update = querymaker(company,3);

  SuperUserServ
    .findOne(query)//find if the company id exist
    .then(function(result){
      console.log(result);
      if(result != null){
        SuperUserServ
          .findOne(queryname)//check if the new company name(chi/eng) is used
          .then(function(nresult){
            if(nresult == null){
              console.log("before updated");
              SuperUserServ
              .update(query,update)
              .then(function(result){
                console.log("After updated");
                          if(company.department!= undefined){
                            var update2 = embeddedmaker(company.department);
                            var updateinit = {$set:{department:[]}};
                            SuperUserServ
                            .update(query,updateinit)//initialize department.name of that record
                            .then(function(result){
                                  SuperUserServ
                                  .update(query,update2)//set department.name of that record
                                  .then(function(result){
                                    res.send('Record has been updated');
                                  }).catch(function(err){
                                    res.status(500).send('Error: '+err);
                                  })
                            }).catch(function(err){
                              res.status(500).send('Error: '+err);
                            })
                          }
                          res.send('Record has been updated');
              }).catch(function(err){
                res.status(500).send('Error :' + err);
              })
            }
            else{
              res.send('Chinese name or English name is used');
            }
          }).catch(function(err){
            res.status(500).send('Error :' + err);
          })
      }else{
        res.status(500).send('Record inexistent!');
      }
    })
    .catch(function(err){
      res.status(500).send('Error :' + err);
    })
});



function querymaker(company,functionid){//functionid:2 == query method,functionid:3 == update method
  var query1={};
  var size;
  if(functionid==3){//if update method called this function
    var condition = null;
  }else{
    var condition = "";
  }
  if(company.deptid!='' && company.deptid!=undefined){//build a query to query method with department
        var deptidtemp = {};
        query1.department = {$elemMatch:{_id:{}}};
        deptidtemp = deptquerymaker('deptid',company.deptid);//build an array with deptid
          query1.department.$elemMatch._id.$in = deptidtemp;
        console.log('query1  '+JSON.stringify(query1));
  }
  if(company.deptn!='' && company.deptn!=undefined){//build a query to query method with department
        var deptidtemp = {};
        deptidtemp = deptquerymaker('deptn',company.deptn);//build an 'like' array with deptn(ame)
        console.log(deptidtemp);
        if(company.deptid==''||company.deptid==undefined){
          query1.department = {$elemMatch:{name:{}}};
          query1.department.$elemMatch.name.$in = deptidtemp;
        }else{//To avoid the _id query be replaced by name query,expand the $elemMatch query with $or
          var ortemp = query1.department.$elemMatch;
          query1.department.$elemMatch = {};
          query1.department.$elemMatch.$or = [ortemp,{name:{$in:deptidtemp}}];
        }
  }
  if(company.id!=undefined && company.id!='' &&functionid==2){//build a query to query method with id
      query1.id = company.id;
  }
  if(company.chiname!=undefined && company.chiname!=''){//build a query to query method with chiname
    if(functionid==2){
      query1.chiname = new RegExp(company.chiname,'i');//search company chiname with 'like'
    }
    else if(functionid==3){
      query1.chiname = company.chiname;
    }
  }
  if(company.engname!=undefined && company.engname!=''){//build a query to query method with engname
    if(functionid==2){
      query1.engname = new RegExp(company.engname,'i');//search company engname with 'like'
    }
    else if(functionid==3){
      query1.engname = company.engname;
    }
  }
  var colsarray = ['code','status','description','assigned_date'];//add these 4 condition to the query if exists
  for(var i=0;i<colsarray.length;i++){
    if(company[colsarray[i]]!=undefined && company[colsarray[i]]!=condition){
      if(i>2){
        if(functionid==2 ){//functionid:2==query method and it uses 'between' below
          break;
        }else{//else it is from update method
          company[colsarray[i]]=dateFormat(new Date(company[colsarray[i]]),'isoDate');
        }
      }
      query1[colsarray[i]]=company[colsarray[i]];
    }
  }
  if((company.start_date != '' || company.end_date != '') && functionid==2){//if any date is entered
    query1.assigned_date = {};
    var start_date ;
    var end_date ;
    if(company.start_date == ''){
      start_date = dateFormat(new Date("2016-06-30"), "isoDate");//start from system start running date
      end_date = dateFormat(new Date(company.end_date),"isoDate");
    }else if(company.end_date == ''){
      start_date = dateFormat(new Date(company.start_date),"isoDate");
      end_date = dateFormat(new Date(), "isoDate");//get current date
    }else{
      start_date = dateFormat(new Date(company.start_date),"isoDate");//user entered two arguments
      end_date = dateFormat(new Date(company.end_date),"isoDate");
    }
    console.log('start_date'+start_date+'  end_date'+end_date);
    query1.assigned_date = {$gte:start_date,$lte:end_date};
  }
  console.log('functionid '+functionid+' querymaker'+JSON.stringify(query1));
  return query1;
}


function deptquerymaker(key,value){
  var querytemp = [];
  var temp1 ;
  var size = deptsize(value);
  if(size==-1){
    if(key=='deptn'){
      querytemp[0] = new RegExp(value,'i');
    }
    else{
      querytemp[0] = value;
    }
  }else{
    for(i=0;i<size;i++){
      if(key=='deptn'){
        querytemp[i] = new RegExp(value[i],'i');
      }
      else{
        querytemp[i] =value[i];
      }
    }
  }
  console.log('querytemp '+JSON.stringify(querytemp)+'  key  '+key);
  return querytemp;
}


app.post("/api/company/query", function(req, res) {
  var company = req.body;
  console.log(JSON.stringify(company));
  var query=querymaker(company,2);
  SuperUserServ
    .finds(query)
    .then(function(result){
      if(result.length>0){
        res.send(result);
      }else{
        res.status(500).send('No Company Found');
      }
    })
    .catch(function(err){
      res.status(500).send('Error :' + err);
    })
});


app.get("/api/company/queryOne", function(req, res) {
  var company = req.query;
  var company_query = {id:company.id};
  SuperUserServ
    .findOne(company_query)
    .then(function(result){
      if(result!=null){
        res.send(result);
      }else{
        res.status(500).send('No Company Found');
      }
    })
    .catch(function(err){
      res.status(500).send('Error :' + err);
    })
});


app.get("/api/company/queryAll", function(req, res) {
  SuperUserServ
    .find()
    .then(function(result){
      if(result.length>0){
        res.send(result);
      }else{
        res.status(500).send('No Company Found');
      }
    })
    .catch(function(err){
      res.status(500).send('Error :' + err);
    })
});


app.delete("/api/company/delete", function(req, res) {
  var del = {id:req.query.id};//delete by company id

  SuperUserServ
    .remove(del)
    .then(function(result){
      var obj=JSON.parse(result);
        if(obj.n!=0){
          res.send('Company has been removed');
        }
        else{
          res.status(500).send('No company found! ');
        }
    }).catch(function(err){
      res.status(500).send('Error : '+err);
    })
});
