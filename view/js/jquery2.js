(function(window) {

	var $ = function( selector ) {
		
		return new $.fn.init( selector );
	};

	$.fn = $.prototype = {
	
		constructor: $,
		length: 0
	};

	var init = $.fn.init = function( selector ) {
		
		return document.querySelectorAll(selector);
	};


	init.prototype = $.fn;

	window.$ = $;

})(window);