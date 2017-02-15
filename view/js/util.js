var $ = function(selector) {
	return document.querySelector(selector);
};
$.ajax = function(req) {
	if(typeof data === 'function'){
		callback = data;
	}
	var xhr = new XMLHttpRequest();
	xhr.open(req.method, req.url, req.async);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				req.success && req.success(xhr.response);
			}
		}
	}
	xhr.send();
}
// $.get = function(url, data, callback) {
// 	if(typeof data === 'function'){
// 		callback = data;
// 	}
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', '/todos', true);
// 	xhr.onreadystatechange = function() {
// 		if(xhr.readyState == 4){
// 			if(xhr.status == 200){
// 				callback(xhr.response);
// 			}
// 		}
// 	}
// 	xhr.send();
// }