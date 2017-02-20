var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
// var util = require('util');
var app = express();
var expressWs = require('express-ws')(app);

var db = mysql.createConnection({
  user:'root',
  host:'localhost',
  database:'todolist'
});
db.connect();

var viewPath = '../../../view/';
app.use(express.static(viewPath));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// 获取列表
app.get('/todos', function (req, res) {
  var q = req.query;
  var sqlText = 'select * from list';
  if(q.hasOwnProperty('isTick')){
    sqlText += ' where isTick = '+q.isTick;
  }
  db.query(sqlText,function(err,data,other){
    res.json(data);
  });
});
// websocket协议获取
app.ws('/todos', function(ws, req) {
  // util.inspect(ws);

  var interval = setInterval(function (){
    var q = req.query;
    var sqlText = 'select * from list';
    if(q.hasOwnProperty('isTick')){
      sqlText += ' where isTick = '+q.isTick;
    }
    db.query(sqlText,function(err,data,other){
      ws.send(JSON.stringify(data));
    });

  },4000);

  ws.on('close', function (){
    // websocket关闭时(浏览器关闭页面)如果不清除定时器，那么服务端会报错，因为ws已经被关闭了，无法send
    clearInterval(interval);
  });

})

// 新增任务
app.post('/todos', function (req, res) {
  var name = req.body.name;
  db.query('insert into list (name) values("'+name+'")', function(err, data){
    if(!err){
      res.json({id:data.insertId,name:name,isTick:0});
    }else{
      console.log(err);
      res.json({});
    }
  });
});

// 修改任务
app.put('/todos/:id', function (req, res) {
  var updateText = '';
  var id = req.params.id;
  var obj = req.body;

  for (var k in obj) {
    if(k=='isTick'){
      updateText += ' '+ k + '=' + (obj[k]?1:0) + ' ,';
    }else if(k!='id'){
      updateText += ' '+ k + '="' + obj[k] + '"  ,';
    }
  }
  //去掉最后的逗号
  updateText = updateText.substr(0, updateText.length - 1);
  db.query('update list set ' + updateText + ' where id='+id, function(err, data){
    if(!err){
      obj.id = id;
      res.json(obj);
    }else{
      console.log(err);
      res.json({});
    }
  });
});

// 删除任务
app.delete('/todos/:id', function (req, res) {
  var id = req.params.id;
  db.query('delete from list where id = '+id, function(err, data){
    if(!err){
      res.json({id:id});
    }else{
      console.log(err);
      res.json({});
    }
  });
});

// 删除已完成的任务
app.post('/todos/delf', function (req, res) {
  var ids = req.body.filteredTodosIds;
  db.query('delete from list where id in ('+ids+')', function(err, data){
    if(!err){
      res.json({ids:ids});
    }else{
      console.log(err);
      res.json({});
    }
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Todolist app listening at http://%s:%s', host, port);
});
