var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('md5');
var multer = require('multer');
var app = express();

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
  console.log(q);
  var sqlText = 'select * from list';
  if(q.hasOwnProperty('isTick')){
    sqlText += ' where isTick = '+q.isTick;
  }
  db.query(sqlText,function(err,data,other){
    res.json(data);
  });
});

// 新增任务
app.post('/todos', function (req, res) {console.log(req.body);
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


var storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: process.cwd() + '/upload',
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        // var fileFormat =(file.originalname).split(".");console.log(fileFormat);
        cb(null, file.originalname);
        // cb(null, file.fieldname + '-' + md5(file) + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
var upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
});


app.post('/upload', upload.single('file'), function (req, res) {
    if (req.file) {
      console.log(req.file);
      res.send('文件上传成功')
    }else{
      res.json({status:0});
    }
});










var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Todolist app listening at http://%s:%s', host, port);
});
