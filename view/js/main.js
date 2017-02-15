var xhr = new XMLHttpRequest();
xhr.open('GET', '/todos', true);
xhr.onreadystatechange = function() {
	if(xhr.readyState == 4){
		if(xhr.status == 200){
			console.log(JSON.parse(xhr.response));
		}
	}
}
xhr.send();
$.get('aaa',1,function(){

})
var app = document.querySelectorAll('#app');
