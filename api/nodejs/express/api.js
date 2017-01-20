var express = require('express');
var app = express();

// 获取列表
app.get('/todos', function (req, res) {
  res.send('Hello World!');
});

// 新增任务
app.post('/todos', function (req, res) {
  res.send('Got a POST request');
});

// 修改任务
app.put('/todos', function (req, res) {
  res.send('Got a PUT request at /user');
});

// 删除任务
app.delete('/todos', function (req, res) {
  res.send('Got a DELETE request at /user');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Todolist app listening at http://%s:%s', host, port);
});
