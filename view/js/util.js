var typeTags = {
	object:'[object Object]',
	function:'function'
};

var $ = function(selector){
  return document.querySelectorAll(selector);
};

$.dataEncode = function(obj) {
	var body = '';
	for(var k in obj){
		body += k+'='+obj[k]+'&';
	}
	return body;
};
$.urlQuery = function(url, obj) {
	return url + '?' + $.dataEncode(obj);
};
$.ajax = function(req) {

	var xhr = new XMLHttpRequest();

  req.method = req.method || 'GET';

	var isGet = req.method.toUpperCase() === 'GET';
	var isObjectData = req.data && req.data.toString() === typeTags.object;

	req.url = isGet && isObjectData ? $.urlQuery(req.url, req.data) : req.url;
	req.async = req.async === undefined ? true : req.async;

	xhr.open(req.method, req.url, req.async);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				req.success && typeof req.success === typeTags.function && req.success(JSON.parse(xhr.response));
			}
		}
	}
	if(isGet){
		xhr.send();
	}else{
		var body = req.data && req.data.toString() === typeTags.object ? $.dataEncode(req.data) : null;
		xhr.send(body);
	}

}
$.get = function(url, data, callback) {
	var ajaxObj = {
		url:url,
		method:'GET',
	};
	if(typeof data === 'function'){
		callback = data;
	}else{
		ajaxObj.data = data;
	}
	ajaxObj.success = callback;
	$.ajax(ajaxObj);
};
$.post = function(url, data, callback) {
	var ajaxObj = {
		url:url,
		method:'POST',
	};
	if(typeof data === 'function'){
		callback = data;
	}else{
		ajaxObj.data = data;
	}
	ajaxObj.success = callback;
	$.ajax(ajaxObj);
};
