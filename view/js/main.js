// var xhr = new XMLHttpRequest();
// xhr.open('GET', '/todos', true);
// xhr.onreadystatechange = function() {
// 	if(xhr.readyState == 4){
// 		if(xhr.status == 200){
// 			console.log(JSON.parse(xhr.response));
// 		}
// 	}
// }
// xhr.send();

$.ajax({
	url:'/todos',
	method:'get',
	data:{name:'撒打算'},
	success:function(data) {
		console.log(data);
	}
});

var app = $('#app');
console.log(app);