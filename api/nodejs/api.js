var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var qs = require('querystring');

var db = mysql.createConnection({
	user:'root',
	host:'localhost',
	database:'todolist'
});
db.connect();
http.createServer(function(req, res){

	if(req.url == '/'){
    resResource('../../view/angular/index.html','text/html');
	}else if(req.url.substr(0,7) == '/public'){
    fs.stat('../../view/angular' + req.url, function (err, stat) {
      if(err || !stat.isFile()){
        res.writeHead(404);
        res.end(JSON.stringify({status:0, msg:'not found'}));
        return;
      }
    });
    var type = 'image/png';
    if(/\.js/.test(req.url) || /\.js.map/.test(req.url)){
      type = 'text/javascript';
    }else if(/\.png/.test(req.url) || /\.jpg/.test(req.url)){
      type = 'image/png';
    }
    resResource('../../view/angular' + req.url, type);

  }else if(req.url == '/list'){

		db.query('select * from list',function(err,data,other){
      res.writeHead(200, {'Content-Type':'application/json'});
			res.end(JSON.stringify(data));
		});

	}else if(req.url == '/add'){
		var body = '';
		req.on('data',function(chunk){
			body+=chunk;
		});
		req.on('end',function(){
      var obj = JSON.parse(body);
			db.query('insert into list (name) values("'+obj.name+'")', function(err, data){
				if(!err){
          var resObj = {newTask:{id:data.insertId,name:obj.name,isTick:0}, status:"1"};
          res.end(JSON.stringify(resObj));
				}else{
					console.log(err);
					res.end(JSON.stringify({status:"0"}));
				}
			});
		});

	}else if(req.url == '/del'){
		var body = '';
		req.on('data',function(chunk){
			body+=chunk;
		});
		req.on('end',function(){
      var obj = JSON.parse(body);
      db.query('delete from list where id in('+obj.ids+')', function(err, data){
        if(!err){
          res.end(JSON.stringify({status:"1"}));
        }else{
          //console.log(err);
          res.end(JSON.stringify({status:"0"}));
        }
      });


		});
	}else if(req.url == '/update'){
		var body = '';
		req.on('data',function(chunk){
			body+=chunk;
		});
		req.on('end',function(){
      var obj = JSON.parse(body);
      var updateText = '';
      for (var k in obj) {
        if(k!='id'){
          updateText += ' '+ k + '="' + obj[k] + '" ';
        }
      }
			db.query('update list set ' + updateText + ' where id='+obj.id, function(err, data){
				if(!err){
					res.end(JSON.stringify({status:"1"}));
				}else{
					console.log(err);
					res.end(JSON.stringify({status:"0"}));
				}
			});

		});
	}else{
    res.writeHead(404);
    res.end(JSON.stringify({status:0,msg:'not found'}));
  }

  function resResource(path, type) {
    res.writeHead(200, {'Content-Type':type});
    fs.createReadStream(path).pipe(res);
  }

}).listen(3000, function(){
	console.log('正在监听端口3000');
});

process.on('uncaughtException',function(err){
	console.log(err);
});


